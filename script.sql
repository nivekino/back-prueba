--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-07-31 01:52:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16410)
-- Name: movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    budget integer NOT NULL,
    date character varying(255) NOT NULL,
    duration integer NOT NULL,
    img character varying(255),
    category character varying(255),
    description character varying(255)
);


ALTER TABLE public.movie OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16409)
-- Name: movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movie_id_seq OWNER TO postgres;

--
-- TOC entry 3332 (class 0 OID 0)
-- Dependencies: 214
-- Name: movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;


--
-- TOC entry 217 (class 1259 OID 16419)
-- Name: option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.option (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    urlmenu character varying(255) NOT NULL,
    iconmenu character varying(255) NOT NULL,
    disable boolean DEFAULT false
);


ALTER TABLE public.option OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16418)
-- Name: option_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.option_id_seq OWNER TO postgres;

--
-- TOC entry 3333 (class 0 OID 0)
-- Dependencies: 216
-- Name: option_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.option_id_seq OWNED BY public.option.id;


--
-- TOC entry 3178 (class 2604 OID 16413)
-- Name: movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);


--
-- TOC entry 3179 (class 2604 OID 16422)
-- Name: option id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.option ALTER COLUMN id SET DEFAULT nextval('public.option_id_seq'::regclass);


--
-- TOC entry 3182 (class 2606 OID 16417)
-- Name: movie movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (id);


--
-- TOC entry 3184 (class 2606 OID 16424)
-- Name: option option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.option
    ADD CONSTRAINT option_pkey PRIMARY KEY (id);

-- Data for Name: option; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.option (id, name, urlmenu, iconmenu, disable) VALUES (1, 'Movies', '/movies', 'fa-solid fa-camera-movie', false);
INSERT INTO public.option (id, name, urlmenu, iconmenu, disable) VALUES (6, 'Manage option', '/ManageOption', 'fa-solid fa-filter-list', false);
INSERT INTO public.option (id, name, urlmenu, iconmenu, disable) VALUES (4, 'Managment Movies', '/ManagmentMovies', 'fa-solid fa-list-check', false);

-- Completed on 2023-07-31 01:52:58

--
-- PostgreSQL database dump complete
--

