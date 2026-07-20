#Temprature label
temp = float(input("Enter temperature: "))

if temp < 15:
    print("cold")
elif temp >= 15 and temp <= 28:
    print("warm")
else:
    print("hot")

#Receipt loop
item = 1
for item in range(1, 11):
    print(f"Receipt #{item} .")


#Even number
num = 1
for num in range(1, 21):
    if num % 2 == 0:
        print(num)


#Discount function
def apply_discount(price, percent=10):
    discount_amount = price * (percent / 100)
    final_price = price - discount_amount
    return final_price

print(apply_discount(100))      
print(apply_discount(100, 20))  


#Countdown
count = 5
while count >= 1:
    print(count)
    count -= 1

print("Liftoff!")