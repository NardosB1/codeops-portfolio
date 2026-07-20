print("Enter the total bill:")
def split_bill(total, people, tip_rate=0.10):
    total_with_tip = total * (1 + tip_rate)
    per_person = total_with_tip / people
    return per_person
# float
group_size = 3          
custom_tip = 0.15       
use_custom_tip = True   
bill_total = int( input())

if group_size <= 0:
    print(f"Base Bill: {bill_total} ETB")
    print(f"Divided by: {group_size} people")
if use_custom_tip == True:
        # Pass the custom tip rate to override the default parameter
        final_share = split_bill(bill_total, group_size, custom_tip)
        print(f"Using Custom Tip ({custom_tip * 100}%).")
else:
        # Fall back on the function's default parameter (10%)
        final_share = split_bill(bill_total, group_size)
        print("Using Default Tip (10%).")

print(f"Each person owes: {final_share:.2f} ETB")