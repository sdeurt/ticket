-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.ticket
(
    id integer NOT NULL DEFAULT nextval('ticket_id_seq'::regclass),
    message character varying COLLATE pg_catalog."default" NOT NULL,
    done boolean DEFAULT false,
    created_at date DEFAULT CURRENT_DATE,
    user_id integer,
    CONSTRAINT ticket_pkey PRIMARY KEY (id)
);
END;