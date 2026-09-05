#gitBankConfig Singleton
class BankConfig:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


#Observer Classes
class SMSAlert:
    def update(self, event):
        print(f"[TeleBirr SMS] {event}")

class AuditLog:
    def update(self, event):
        print(f"[Log] {event}")


#Account Hierarchy with SRP & Observer Support
class Account:
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.number = number
        self.balance = balance
        self._observers = []

    def subscribe(self, obs):
        self._observers.append(obs)

    def _notify(self, event):
        for obs in self._observers:
            obs.update(event)

    def withdraw(self, amount):
        self.balance -= amount
        self._notify(f"-{amount} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, number, balance=0):
        super().__init__(owner, number, balance)
        self.config = BankConfig()


class CurrentAccount(Account):
    def __init__(self, owner, number, balance=0):
        super().__init__(owner, number, balance)
        self.config = BankConfig()


#Account Factory
class AccountFactory:
    @staticmethod
    def create(kind, owner, number, balance=0):
        if kind == "savings":
            return SavingsAccount(owner, number, balance)
        if kind == "current":
            return CurrentAccount(owner, number, balance)
        raise ValueError(f"Unknown type: {kind}")


#Verification Code
if __name__ == "__main__":
    # Test Singleton
    cfg1, cfg2 = BankConfig(), BankConfig()
    print("Same config object:", cfg1 is cfg2)

    # Test Factory & Observer
    acc = AccountFactory.create("savings", "Almaz", "CBE-1", 1500)
    acc.subscribe(SMSAlert())
    acc.subscribe(AuditLog())
    acc.withdraw(500)