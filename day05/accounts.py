class Account:
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.account_number = number
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient funds for overdraft")
        self.__balance -= amount

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

    def statement(self):
        print(f"Current Account | Owner: {self.owner} | Number: {self.account_number} | Balance: {self.balance} ETB | Overdraft Limit: {self.overdraft} ETB")