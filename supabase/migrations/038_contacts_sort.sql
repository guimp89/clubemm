-- ============================================================
-- 038_contacts_sort
--
-- Adds sortable columns to the Contacts table (name A→Z/Z→A,
-- last purchase date, created date). The plain contacts query
-- already sorts client-side via .order(); this migration only
-- needs to extend filter_contacts_by_tags (025) so the tag-filtered
-- path supports the same sort options instead of being stuck on
-- created_at DESC.
--
-- p_sort_by/p_sort_dir are new optional params with defaults that
-- match the function's previous behavior, so existing callers that
-- don't pass them keep working unchanged.
--
-- Idempotent. The new params change the function's signature, so
-- Postgres would otherwise keep the old 4-arg version around as a
-- second overload — drop it first to avoid ambiguous-call surprises.
-- ============================================================

DROP FUNCTION IF EXISTS public.filter_contacts_by_tags(UUID[], TEXT, INT, INT);

CREATE OR REPLACE FUNCTION public.filter_contacts_by_tags(
  p_tag_ids UUID[],
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 25,
  p_offset INT DEFAULT 0,
  p_sort_by TEXT DEFAULT 'created_at',
  p_sort_dir TEXT DEFAULT 'desc'
)
RETURNS TABLE (contact contacts, total_count BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH matched AS (
    SELECT DISTINCT c.id, c.name, c.last_purchase_at, c.created_at
    FROM contacts c
    JOIN contact_tags ct ON ct.contact_id = c.id
    WHERE ct.tag_id = ANY(p_tag_ids)
      AND (
        p_search IS NULL
        OR c.name ILIKE '%' || p_search || '%'
        OR c.phone ILIKE '%' || p_search || '%'
        OR c.email ILIKE '%' || p_search || '%'
      )
  ),
  page AS (
    -- Only one of these CASE expressions is non-null for a given
    -- p_sort_by/p_sort_dir pair; the rest evaluate to NULL for every
    -- row and are therefore no-op tiebreakers, falling through to
    -- the next key. created_at DESC, id is the final tiebreaker so
    -- ordering stays stable regardless of which sort is active.
    SELECT id, count(*) OVER() AS total_count
    FROM matched
    ORDER BY
      CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'asc' THEN name END ASC NULLS LAST,
      CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'desc' THEN name END DESC NULLS LAST,
      CASE WHEN p_sort_by = 'last_purchase_at' AND p_sort_dir = 'asc' THEN last_purchase_at END ASC NULLS LAST,
      CASE WHEN p_sort_by = 'last_purchase_at' AND p_sort_dir = 'desc' THEN last_purchase_at END DESC NULLS LAST,
      CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'asc' THEN created_at END ASC,
      CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'desc' THEN created_at END DESC,
      created_at DESC,
      id
    LIMIT p_limit OFFSET p_offset
  )
  SELECT c AS contact, page.total_count
  FROM page
  JOIN contacts c ON c.id = page.id
  ORDER BY
    CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'asc' THEN c.name END ASC NULLS LAST,
    CASE WHEN p_sort_by = 'name' AND p_sort_dir = 'desc' THEN c.name END DESC NULLS LAST,
    CASE WHEN p_sort_by = 'last_purchase_at' AND p_sort_dir = 'asc' THEN c.last_purchase_at END ASC NULLS LAST,
    CASE WHEN p_sort_by = 'last_purchase_at' AND p_sort_dir = 'desc' THEN c.last_purchase_at END DESC NULLS LAST,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'asc' THEN c.created_at END ASC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'desc' THEN c.created_at END DESC,
    c.created_at DESC,
    c.id;
$$;

ALTER FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT, TEXT, TEXT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT, TEXT, TEXT) TO authenticated;
