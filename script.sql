PGDMP     7    '                {            movie-galery    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16408    movie-galery    DATABASE     �   CREATE DATABASE "movie-galery" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_United States.1252';
    DROP DATABASE "movie-galery";
                postgres    false            �            1259    16410    movie    TABLE     �   CREATE TABLE public.movie (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    budget integer NOT NULL,
    date character varying(255) NOT NULL,
    duration integer NOT NULL,
    img character varying(255)
);
    DROP TABLE public.movie;
       public         heap    postgres    false            �            1259    16409    movie_id_seq    SEQUENCE     �   CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.movie_id_seq;
       public          postgres    false    215                       0    0    movie_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;
          public          postgres    false    214            �            1259    16419    option    TABLE     b   CREATE TABLE public.option (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.option;
       public         heap    postgres    false            �            1259    16418    option_id_seq    SEQUENCE     �   CREATE SEQUENCE public.option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.option_id_seq;
       public          postgres    false    217            	           0    0    option_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.option_id_seq OWNED BY public.option.id;
          public          postgres    false    216            j           2604    16413    movie id    DEFAULT     d   ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);
 7   ALTER TABLE public.movie ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            k           2604    16422 	   option id    DEFAULT     f   ALTER TABLE ONLY public.option ALTER COLUMN id SET DEFAULT nextval('public.option_id_seq'::regclass);
 8   ALTER TABLE public.option ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �          0    16410    movie 
   TABLE DATA           F   COPY public.movie (id, name, budget, date, duration, img) FROM stdin;
    public          postgres    false    215   �                 0    16419    option 
   TABLE DATA           *   COPY public.option (id, name) FROM stdin;
    public          postgres    false    217   w       
           0    0    movie_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.movie_id_seq', 4, true);
          public          postgres    false    214                       0    0    option_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.option_id_seq', 1, false);
          public          postgres    false    216            m           2606    16417    movie movie_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.movie DROP CONSTRAINT movie_pkey;
       public            postgres    false    215            o           2606    16424    option option_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.option
    ADD CONSTRAINT option_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.option DROP CONSTRAINT option_pkey;
       public            postgres    false    217            �   �   x����� ��a
 .`U:�� &��J��v�N��J�4n�y9/��w$�"��Kj�C���T��O݊���e߯~�? D��J�sr�q	g!B�kk�[������$��0��=qp�nJ� da��U*��}����P{.e��nϏ�e*(���pJ�L4~�            x������ � �     