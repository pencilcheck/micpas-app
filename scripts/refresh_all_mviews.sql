-- https://wiki.postgresql.org/wiki/Refresh_All_Materialized_Views
set max_parallel_workers_per_gather = 0;
SELECT string_agg(
       'REFRESH MATERIALIZED VIEW "' || schemaname || '"."' || relname || '";',
       E'\n' ORDER BY refresh_order) AS script
FROM mat_view_refresh_order WHERE schemaname='public' \gset

-- Visualize the script
\echo :script

-- Execute the script
:script
