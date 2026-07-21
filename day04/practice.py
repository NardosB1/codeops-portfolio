#Book Class (Basic Classes and Methods)
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        return f"The book '{self.title}' is written by {self.author}, having {self.pages} pages."


book1 = Book("Python Crash Course", "Eric Matthes", 544)
book2 = Book("Automate the Boring Stuff", "Al Sweigart", 504)

print(book1.describe())
print(book2.describe())


#Product class
class product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity
    def restock(self, amount):
        if amount <=0 :
           return ValueError ("amount must be greater than zero")
        self.quantity += amount
        return self.quantity
    def sell(self, amount):
        if amount <= 0 :
            return ValueError ("amount must be greater than zero")
        elif amount > self.quantity :
            return ValueError ("insufficient amount")
        self.quantity -= amount
        return self.quantity

product1 = product("milk", 50, 10)
print(product1.sell(11))


#Make it private and #Validate
class product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity
    @property 
    def quantity (self):
        return self.__quantity
    @quantity.setter
    def quantity (self, value):
        if value < 0 :
            return ValueError ("quantity can't be negative")
        else :
            self.__quantity = value
    def restock(self, amount):
        if amount <=0 :
           return ValueError ("amount must be greater than zero")
        self.__quantity += amount
        return self.__quantity
    def sell(self, amount):
        if amount <= 0 :
            return ValueError ("amount must be greater than zero")
        elif amount > self.__quantity :
            return ValueError ("insufficient amount")
        self.__quantity -= amount
        return self.__quantity

product1 = product("milk", 50, 10)
product2 = product("water", 40, 30)
product3 = product("pen", 25, 15)


print(product1.quantity)
product1.quantity = 15
print(product1.quantity)
print(product2.quantity )
print(product3.quantity )



#Prove independence


