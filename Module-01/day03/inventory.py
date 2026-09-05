#Load Data safely
stock = {}
try:
    with open("stock.txt", "r") as f:
        for line in f:
            item, qty = line.strip().split(",")
            stock[item] = int(qty)
except FileNotFoundError:
    print("No stock file yet — starting empty")

#Define Actions
def adjust(item, amount):
    stock[item] = stock.get(item, 0) + amount
    print(f"Adjusted {item} by {amount}. New total: {stock[item]}")

#Simulate a Day of Transactions
print("\n--- TRANSACTIONS ---")
adjust("Amoxicillin", -5)   
adjust("Paracetamol", 20)   
adjust("Vitamin-C", -2)     
adjust("Bandages", 15)      

#Report Low Stock
low = [item for item, qty in stock.items() if qty < 10]
print(f"\nLow stock items (< 10): {low}")

#Save to Disk (Your Turn!)
print("\n--- SAVING TO DISK ---")

try:
    with open("day03/stock.txt", "w") as f:
        for item, qty in stock.items():
            f.write(f"{item},{qty}\n")     
    print("Inventory successfully saved.")
except Exception as e:
    print(f"Error saving inventory: {e}")

