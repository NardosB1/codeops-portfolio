#List
cities = ["Addis Ababa", "Bahir Dar", "Adama", "Addis Ababa", "Hawassa", "Gondar", "Mekelle", "Jima", "Harar", "Bishoftu", "Dire Dawa", "Shashmene"]

#cities[0]
#cities.append("Debre Birhan")
#cities.insert(2, "Wolkite")
#cities.remove("wolkite")
#cities.sort()

#for city in cities:
#    print(city)


customer ={
    "name" : "Abebe",
    "balance" : 1500,
    "city" : "Addis Ababa",
}

customer['city'] = "Adama"
customer['gender'] = "male"
 
#print(customer.get ("phone_number"))

#for key,valu in customer.items():
#print(customer.items())
#print("name" in customer)



#city_set = {1, 2, 3}
coll_1 = {1, 2, 3, 4}
coll_2 = {4, 5, 6, 7}


#print(cities)
city_set = set(coll_1 | coll_2)
city_set = set(coll_1 & coll_2)
city_set = set(coll_1 - coll_2)
#print(city_set)


#import math
#pi = math.sqrt(16)
#print(pi)
#from math import pow
#pow(5, 2)

#import math as m   #alias



  # for line in file:
    # print(line.strip())


#try:   
   #with open("note.txt", "w") as file:
    #print(file.write(" \r Hello Class"))
#except FileExistsError:
    #print('The file is already created, please change your mode')
#except FileNotFoundError:
   #print('File not found')    
#else:
   #print('File opened successfully')  
#finally:
   #print("Done")


total = 0
try:
      with open("telebirr.txt") as f:
            for line in f:
                  total += int(line.strip())
except FileNotFoundError:
      print("No transaction found")
else:
      print("total=")                        