class Account:
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.account_number = number
        self.__balance = balance
#Give each account a history stack to track transactions
        self.history = []

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
#Give each account a history stack; push a record on every deposit and withdrawal.
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
#Give each account a history stack; push a record on every deposit and withdrawal.
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient funds for overdraft")
        self.__balance -= amount
        self.history.append(("withdraw", amount))

    def statement(self):
        print(f"Account | Owner: {self.owner} | Number: {self.account_number} | Balance: {self.__balance} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, number, balance=0, rate=0.05):
        super().__init__(owner, number, balance)
        self.rate = rate

    def add_interest(self):
        self.deposit(self.balance * self.rate)

    def statement(self):
        print(f"Savings Account | Owner: {self.owner} | Number: {self.account_number} | Balance: {self.balance} ETB | Rate: {self.rate * 100}%")


class CurrentAccount(Account):
    def __init__(self, owner, number, balance=0, overdraft=1000):
        super().__init__(owner, number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if (self.balance - amount) < -self.overdraft:
            raise ValueError("Exceeds overdraft limit")
        self._Account__balance -= amount
#Give each account a history stack; push a record on every deposit and withdrawal.
        self.history.append(("withdraw", amount))

    def statement(self):
        print(f"Current Account | Owner: {self.owner} | Number: {self.account_number} | Balance: {self.balance} ETB | Overdraft Limit: {self.overdraft} ETB")


class AccountRegistry:
    def __init__(self):
#Store accounts in a dict keyed by account number.
        self.by_number = {} 
#Add list_all() that returns accounts in insertion order.
        self.order = [] 

    def add(self, acc):
        self.by_number[acc.account_number] = acc
        self.order.append(acc.account_number)

    def find(self, number):
        return self.by_number.get(number)

    def list_all(self):
#Add list_all() that returns accounts in insertion order.
        return [self.by_number[num] for num in self.order]

    def undo_last(self, number):
#Add undo_last() that pops the most recent transaction and reverses its effect.
        account = self.find(number)
        if not account or not account.history:
            return None
        
        action, amount = account.history.pop()
        if action == "deposit":
            account._Account__balance -= amount
        elif action == "withdraw":
            account._Account__balance += amount
        return (action, amount)



if __name__ == "__main__":
    registry = AccountRegistry()

    acc1 = SavingsAccount("Abebe Bikila", "SB-001", 5000, 0.05)
    acc2 = CurrentAccount("Tsehaynesh Melaku", "CR-002", 2000, 1500)

    registry.add(acc1)
    registry.add(acc2)

    acc1.deposit(1000)
    acc1.statement()

    acc2.withdraw(3000) 
    acc2.statement()

    print("Undoing last transaction on CR-002...")
    registry.undo_last("CR-002")
    acc2.statement()       