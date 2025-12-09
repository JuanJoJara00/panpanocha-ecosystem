-- Deliveries Table
-- Tracks delivery orders, fees, and payments.

create type delivery_status as enum ('pending', 'dispatched', 'delivered', 'cancelled');

create table if not exists deliveries (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Core Details
    product_details text not null, -- Description of what was sent
    delivery_fee decimal(10,2) not null default 0, -- "Valor pagado a domiciliario"
    
    -- Branch Reference (Which branch sent it?)
    branch_id uuid references branches(id),
    
    -- Status
    status delivery_status default 'pending',
    
    -- Evidence / Images
    client_payment_proof_url text, -- "Comprobante del pago del cliente"
    delivery_receipt_url text,     -- "Recibo de caja menor por pago al domiciliario"
    
    -- Metadata
    customer_name text,
    customer_address text,
    customer_phone text,
    
    assigned_driver text -- Optional: Name of delivery person
);

-- RLS Policies
alter table deliveries enable row level security;

create policy "Enable read access for authenticated users"
    on deliveries for select
    to authenticated
    using (true);

create policy "Enable insert for authenticated users"
    on deliveries for insert
    to authenticated
    with check (true);

create policy "Enable update for authenticated users"
    on deliveries for update
    to authenticated
    using (true);
