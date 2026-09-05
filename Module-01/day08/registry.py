class Account:
    def __init__(self, number, name, balance, transactions=None):
        self.number = number
        self.name = name
        self.balance = balance
        self.transactions = transactions if transactions is not None else []

    def __repr__(self):
        return f"Account({self.number}, {self.name}, {self.balance})"


def binary_search(items, target):
    left = 0
    right = len(items) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

# Storing accounts in a dictionary mapping account number to Account object
class AccountRegistry:
    def __init__(self):
        self.by_number = {}

    def add_account(self, account):
        self.by_number[account.number] = account

    def top_by_balance(self, n=5):
        accts = sorted(self.by_number.values(),
                       key=lambda a: a.balance, reverse=True)
        return accts[:n]

    def find_by_number(self, number):
        nums = sorted(self.by_number)  
        i = binary_search(nums, number)
        return self.by_number[nums[i]] if i >= 0 else None

    def total_transactions(self, number):
        account = self.find_by_number(number)
        if not account:
            return 0.0
            
        def recursive_sum(txs):
            if not txs:
                return 0.0
            return txs[0] + recursive_sum(txs[1:])
            
        return recursive_sum(account.transactions)


if __name__ == "__main__":
    registry = AccountRegistry()
    registry.add_account(Account("A001", "Almaz", 1500.0, [100.0, -50.0, 200.0]))
    registry.add_account(Account("A002", "Brook", 4500.5, [500.0, 1000.0]))
    registry.add_account(Account("A003", "Chala", 300.0, [-25.0, 75.0]))
    registry.add_account(Account("A004", "Danat", 8200.0, [1000.0, 2000.0, 5200.0]))
    
    print(f"Top 2 Accounts by Balance: {registry.top_by_balance(2)}")
    print(f"A003: {registry.find_by_number("A003")}")
    print(f"Recursive Transaction Total for A001 = {"Total:", registry.total_transactions("A001")}")