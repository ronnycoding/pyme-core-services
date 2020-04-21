CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.deliveries (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    delivery_status_id integer NOT NULL,
    fee numeric NOT NULL
);
CREATE SEQUENCE public.deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;
CREATE TABLE public.delivery_status (
    id integer NOT NULL,
    delivery_status_id integer NOT NULL,
    delivery_id integer NOT NULL,
    location_id integer NOT NULL
);
CREATE SEQUENCE public.delivery_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.delivery_status_id_seq OWNED BY public.delivery_status.id;
CREATE TABLE public.delivery_statuses (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.delivery_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.delivery_statuses_id_seq OWNED BY public.delivery_statuses.id;
CREATE TABLE public.fees (
    id integer NOT NULL,
    name text NOT NULL,
    fee numeric NOT NULL
);
CREATE SEQUENCE public.fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.fees_id_seq OWNED BY public.fees.id;
CREATE TABLE public.locations (
    id integer NOT NULL,
    lat text NOT NULL,
    long text NOT NULL
);
CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_seen timestamp with time zone
);
CREATE VIEW public.online_users AS
 SELECT users.id,
    users.last_seen
   FROM public.users
  WHERE (users.last_seen >= (now() - '00:00:30'::interval));
CREATE TABLE public.order_products (
    id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    qty integer NOT NULL,
    amount numeric NOT NULL
);
CREATE SEQUENCE public.order_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_products_id_seq OWNED BY public.order_products.id;
CREATE TABLE public.order_status (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    status_id integer NOT NULL,
    order_id integer NOT NULL
);
CREATE SEQUENCE public.order_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_status_id_seq OWNED BY public.order_status.id;
CREATE TABLE public.order_statuses (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.order_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_statuses_id_seq OWNED BY public.order_statuses.id;
CREATE TABLE public.orders (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    total_amount numeric NOT NULL,
    store_id integer NOT NULL,
    user_id uuid NOT NULL,
    fee numeric NOT NULL
);
CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
CREATE TABLE public.product_categories (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;
CREATE TABLE public.products (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    store_id integer NOT NULL,
    name text NOT NULL,
    price numeric,
    description text,
    image text,
    stock_qty integer,
    is_active boolean DEFAULT false,
    is_discount_active boolean DEFAULT false,
    discount integer,
    product_category_id integer NOT NULL
);
CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
CREATE TABLE public.store_categories (
    id integer NOT NULL
);
CREATE SEQUENCE public.store_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.store_categories_id_seq OWNED BY public.store_categories.id;
CREATE TABLE public.stores (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text,
    user_id uuid NOT NULL,
    store_category_id integer NOT NULL,
    location_id integer NOT NULL
);
CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;
ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);
ALTER TABLE ONLY public.delivery_status ALTER COLUMN id SET DEFAULT nextval('public.delivery_status_id_seq'::regclass);
ALTER TABLE ONLY public.delivery_statuses ALTER COLUMN id SET DEFAULT nextval('public.delivery_statuses_id_seq'::regclass);
ALTER TABLE ONLY public.fees ALTER COLUMN id SET DEFAULT nextval('public.fees_id_seq'::regclass);
ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);
ALTER TABLE ONLY public.order_products ALTER COLUMN id SET DEFAULT nextval('public.order_products_id_seq'::regclass);
ALTER TABLE ONLY public.order_status ALTER COLUMN id SET DEFAULT nextval('public.order_status_id_seq'::regclass);
ALTER TABLE ONLY public.order_statuses ALTER COLUMN id SET DEFAULT nextval('public.order_statuses_id_seq'::regclass);
ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);
ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
ALTER TABLE ONLY public.store_categories ALTER COLUMN id SET DEFAULT nextval('public.store_categories_id_seq'::regclass);
ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);
ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.delivery_statuses
    ADD CONSTRAINT delivery_statuses_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.order_statuses
    ADD CONSTRAINT order_statuses_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.store_categories
    ADD CONSTRAINT store_categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_deliveries_updated_at ON public.deliveries IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_orders_updated_at ON public.orders IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_products_updated_at ON public.products IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_stores_updated_at ON public.stores IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_status_id_fkey FOREIGN KEY (delivery_status_id) REFERENCES public.delivery_statuses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_delivery_status_id_fkey FOREIGN KEY (delivery_status_id) REFERENCES public.delivery_statuses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_statuses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_category_id_fkey FOREIGN KEY (product_category_id) REFERENCES public.product_categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_store_category_id_fkey FOREIGN KEY (store_category_id) REFERENCES public.store_categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
