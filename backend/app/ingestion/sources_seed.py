# app/ingestion/sources_seed.py

# A seed list of official sources.
# Since real BIS URLs are not provided, we include clearly marked EXAMPLE/TODO entries.
# Any production scraper would update these to point to the actual URLs.

SEED_SOURCES = [
    {
        "url": "http://example.com/bis_know_your_standard_todo",
        "title": "BIS Know Your Standard Portal (Placeholder)",
        "source_type": "standard_metadata"
    },
    {
        "url": "http://example.com/bis_product_certification_todo",
        "title": "BIS Product Certification Scheme-I/IV Guidance (Placeholder)",
        "source_type": "certification"
    },
    {
        "url": "http://example.com/bis_hallmarking_faq_todo",
        "title": "BIS Hallmarking and HUID FAQ (Placeholder)",
        "source_type": "hallmarking"
    }
]
