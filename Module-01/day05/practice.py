#Vehicle hierarchy
class Vehicle:
    def __init__(self, make, model):
        self.make = make
        self.model = model
    def describe(self):
        print (f"the car was made in {self.make} is {self.model} model.")
class Car(Vehicle):
    pass        
class Truck(Vehicle):
    pass     
car1 = Car("germany", "F12ED")
car1.describe()


#Use super() and #Override and #Polymorphism
class Vehicle:
    def __init__(self, make, model):
        self.make = make
        self.model = model
    def describe(self):
        print (f"the car was made in {self.make} is {self.model} model.")
class Truck(Vehicle):
     def __init__(self, make, model, capacity):
         super().__init__(make, model) 
         self.capacity = capacity
     def describe(self):
         return f"the car was made in {self.make} is {self.model} model having a {self.capacity} capacity."

#truck1 = Truck("italy", "F16", 200)
#truck1.describe()

vehicle = [Truck ("italy", "FR245", 500), Truck ("germany", "FR678", 67)]
for i in vehicle:
    print(i.describe())


#Absract method
from abc import ABC, abstractmethod
class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model
    @abstractmethod   
    def wheels(self, wheel):
        self.wheel = wheel 
        return f"This car has {self.wheel}" 
    def describe(self):
        print (f"the car was made in {self.make} is {self.model} model.")
class Car(Vehicle):
    def __init__(self, make, model, capacity):
         super().__init__(make, model) 
         self.capacity = capacity
    def wheels (self):
         return "This car has 4"    
    def describe(self):
         return f"the car was made in {self.make} is {self.model} model having a {self.capacity} capacity."         
class Truck(Vehicle):
     def __init__(self, make, model, capacity):
         super().__init__(make, model) 
         self.capacity = capacity
     def wheels (self):
      return "This truck has 8"    
     def describe(self):
         return f"the car was made in {self.make} is {self.model} model having a {self.capacity} capacity."

vehicle = [Truck ("italy", "FR245", 500), Truck ("germany", "FR678", 67), Car("ethio", "ET56", 4)]
for i in vehicle:
    print(i.describe())
    print(i.wheels())     
