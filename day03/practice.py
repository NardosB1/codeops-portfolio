#Unique Cities (Sets)
raw_cities = ["Addis Ababa", "Adama", "Addis Ababa", "Hawassa"]
unique = set(raw_cities)
print(f"Set: (raw_cities)")
print(f"Length of set: {len(raw_cities)}")

#Price Report (Dictionaries)
groceries = {"Bread": 50, "Milk": 80, "Egg": 200, "Carrot": 30, "Onion": 700,} 
for item, price in groceries.items():
    print(f"Item={item}| Price={price}")

#Comprehensions (Tax & Cheap Items)
prices = [100, 250, 400, 80]
taxed_prices = [p * 1.15 for p in prices]
print(f"Taxed prices:{taxed_prices}")

cheap = [p for p in prices if p < 300]
print(f"Cheap prices:{cheap}")
#else:
#    discounted = {item: p * 0.9 for item, p in prices.items()}
#    print("Discounted")



#Write & Read (File I/O)
with open("names.txt", "w") as f:
 f.write("Almaz\n")
 f.write("Dawit\n") 
 f.write("Tigist\n") 
 
with open("names.txt", "r") as f: 
 for line in f:
  print(line.strip())


#Safe division
try:
    user_input = int(input("Enter a number to divide 1000 by: "))
    result = 1000 / user_input
    print(f"Result: {result}")

except ValueError:
    print("Error: You must enter a valid number, not text.")

except ZeroDivisionError:
    print("Error: You cannot divide by zero.")   