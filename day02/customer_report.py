# 1. Define dataset: List of tuples holding (name, balance)
customers = [
    ("Almaz", 1500),
    ("Dawit", 700),
    ("Tigist", 200),
    ("Hanna", 1200),
    ("Samuel", 450),
]

# 2. Tier evaluation function
def tier(balance):
    """Returns the matching tier category based on the balance threshold."""
    if balance >= 1000:
        return "Premium"
    elif balance >= 500:
        return "Standard"
    return "Basic"

# 3. Counters for reporting metrics
premium_count = 0
standard_count = 0
basic_count = 0

print("--- CUSTOMER TIER REPORT ---")
# 4. Loop over the customers list
for name, balance in customers:
    customer_tier = tier(balance)
    print(f"Customer: {name:<10} | Tier: {customer_tier:<10} | Balance: {balance} ETB")
    

    if customer_tier == "Premium":
        premium_count += 1
    elif customer_tier == "Standard":
        standard_count += 1
    elif customer_tier == "Basic":
        basic_count += 1

print("\n--- SUMMARY METRICS ---")
print(f"Premium Customers  : {premium_count}")
print(f"Standard Customers : {standard_count}")
print(f"Basic Customers    : {basic_count}")