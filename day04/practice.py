#Book Class (Basic Classes and Methods)
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        print(f"'{self.title}' by {self.author}, {self.pages} pages.")

# Create two books
book1 = Book("Python Crash Course", "Eric Matthes", 544)
book2 = Book("Automate the Boring Stuff", "Al Sweigart", 504)

print("--- Exercise 1 Output ---")
book1.describe()
book2.describe()


#Product Class & 3, 4, 5. Encapsulation & Independence
class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity  # Private attribute (Name Mangling)

    # @property getter to safely expose private quantity
    @property
    def quantity(self):
        return self.__quantity

    # Setter with validation to prevent negative stock
    @quantity.setter
    def quantity(self, value):
        if value < 0:
            print(f"Error: Stock for {self.name} cannot go below zero!")
        else:
            self.__quantity = value

    def restock(self, n):
        # Uses the property setter to apply validation safely
        self.quantity = self.__quantity + n

    def sell(self, n):
        # Checks if we have enough stock before subtracting
        if self.__quantity - n < 0:
            print(f"❌ Error: Cannot sell {n} units of {self.name}. Only {self.__quantity} left!")
        else:
            self.quantity = self.__quantity - n

# Test the Product class, methods, encapsulation, and independence
print("\n--- Exercises 2 to 5 Output ---")
prod1 = Product("Laptop", 45000, 10)
prod2 = Product("Mouse", 1200, 50)
prod3 = Product("Keyboard", 2500, 25)

# Restock and sell operations
prod1.restock(5)
prod1.sell(3)
print(f"{prod1.name} final quantity: {prod1.quantity}")

# Testing validation (trying to drop below zero)
prod2.sell(100) # Should trigger validation error

# Proving object independence
print(f"Prod2 ({prod2.name}) quantity: {prod2.quantity} (Unaffected)")
print(f"Prod3 ({prod3.name}) quantity: {prod3.quantity} (Unaffected)")