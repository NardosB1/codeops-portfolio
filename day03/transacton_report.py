customer_totals = {}

try:
    with open("transactions.txt") as f:
        for line in f:
            name, amount_str = line.strip().split(",")
            amount = float(amount_str)

            customer_totals[name] = customer_totals.get(name, 0.0) + amount

except FileNotFoundError:
    print("Error: The file transactions.txt was not found.")

else:
    report_list = []
    for name, total in customer_totals.items():
        report_list.append([total, name])

    report_list.sort()
    report_list.reverse()

    print("Customer Transaction Summary")
    for total, name in report_list:
        print(f"{name}: {total} ETB")
        
    with open("report.txt", "w") as f:
        f.write("=== Customer Transaction Summary (Highest First) ===\n")
        for total, name in report_list:
            f.write(f"{name}: {total} ETB\n")