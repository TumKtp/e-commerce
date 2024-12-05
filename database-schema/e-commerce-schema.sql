-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
-- Table Definition
CREATE TABLE "public"."customer" (
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "balance" numeric(10, 2) NOT NULL CHECK (balance >= (0) :: numeric),
    "password" varchar NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
DROP TYPE IF EXISTS "public"."order_status_enum";

CREATE TYPE "public"."order_status_enum" AS ENUM ('PROCESSING', 'COMPLETED');

-- Table Definition
CREATE TABLE "public"."order" (
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "customerId" uuid NOT NULL,
    "status" "public"."order_status_enum" NOT NULL DEFAULT 'PROCESSING' :: order_status_enum,
    "totalPrice" numeric(10, 2) NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
-- Table Definition
CREATE TABLE "public"."order_item" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "orderId" uuid NOT NULL,
    "productTypeId" uuid NOT NULL,
    "quantity" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
-- Table Definition
CREATE TABLE "public"."product" (
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar NOT NULL,
    "description" varchar NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
-- Table Definition
CREATE TABLE "public"."product_type" (
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "productId" uuid NOT NULL,
    "type" varchar NOT NULL,
    "price" numeric(10, 2) NOT NULL CHECK (price >= (0) :: numeric),
    "stock" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.
DROP TYPE IF EXISTS "public"."stock_status_enum";

CREATE TYPE "public"."stock_status_enum" AS ENUM ('IN_STOCK', 'SOLD');

-- Table Definition
CREATE TABLE "public"."stock" (
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "code" varchar NOT NULL,
    "status" "public"."stock_status_enum" NOT NULL DEFAULT 'IN_STOCK' :: stock_status_enum,
    "productTypeId" uuid NOT NULL,
    "orderId" uuid NOT NULL,
    PRIMARY KEY ("code")
);

-- Indices
CREATE UNIQUE INDEX "PK_a7a13f4cacb744524e44dfdad32" ON public.customer USING btree (id);

CREATE UNIQUE INDEX "UQ_fdb2f3ad8115da4c7718109a6eb" ON public.customer USING btree (email);

ALTER TABLE
    "public"."order"
ADD
    FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id");

-- Indices
CREATE UNIQUE INDEX "PK_1031171c13130102495201e3e20" ON public."order" USING btree (id);

ALTER TABLE
    "public"."order_item"
ADD
    FOREIGN KEY ("orderId") REFERENCES "public"."order"("id");

ALTER TABLE
    "public"."order_item"
ADD
    FOREIGN KEY ("productTypeId") REFERENCES "public"."product_type"("id");

-- Indices
CREATE UNIQUE INDEX "PK_d01158fe15b1ead5c26fd7f4e90" ON public.order_item USING btree (id);

-- Indices
CREATE UNIQUE INDEX "PK_bebc9158e480b949565b4dc7a82" ON public.product USING btree (id);

CREATE UNIQUE INDEX "UQ_22cc43e9a74d7498546e9a63e77" ON public.product USING btree (name);

ALTER TABLE
    "public"."product_type"
ADD
    FOREIGN KEY ("productId") REFERENCES "public"."product"("id");

-- Indices
CREATE UNIQUE INDEX "PK_e0843930fbb8854fe36ca39dae1" ON public.product_type USING btree (id);

CREATE UNIQUE INDEX "IDX_696572898603f53cdf5573a816" ON public.product_type USING btree ("productId", type);

ALTER TABLE
    "public"."stock"
ADD
    FOREIGN KEY ("productTypeId") REFERENCES "public"."product_type"("id");

ALTER TABLE
    "public"."stock"
ADD
    FOREIGN KEY ("orderId") REFERENCES "public"."order"("id");

-- Indices
CREATE UNIQUE INDEX "PK_c73240b87ebf65d15337579f9fd" ON public.stock USING btree (code);