bill_total = 850.0    
num_people = 4   
def split_bill(total, people, tip_rate=0.10):
    tip_amount = total * tip_rate 
    total_with_tip = total + tip_amount 
    per_person = total_with_tip / people 
    return per_person                   

share = split_bill(bill_total, num_people)

print(f"Bill total: {bill_total} ETB")
print(f"Tip rate applied: 10%")
print(f"Number of people: {num_people}")
print(f"Each person owes: {share:.2f} ETB")
print("-" * 30)


for person in range(1, num_people + 1):    
    print(f"Person {person}: pays {share:.2f} ETB")