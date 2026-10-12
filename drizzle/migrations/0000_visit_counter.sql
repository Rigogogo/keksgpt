CREATE TABLE public.site_stats (id int PRIMARY KEY, visits bigint NOT NULL DEFAULT 0);
GRANT ALL ON public.site_stats TO service_role;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
INSERT INTO public.site_stats (id, visits) VALUES (1, 0);

CREATE OR REPLACE FUNCTION public.register_visit() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.site_stats SET visits = visits + 1 WHERE id = 1;
$$;

CREATE OR REPLACE FUNCTION public.get_visits(_code text) RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN _code = '141' THEN (SELECT visits FROM public.site_stats WHERE id = 1) ELSE NULL END;
$$;

GRANT EXECUTE ON FUNCTION public.register_visit() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_visits(text) TO anon, authenticated;