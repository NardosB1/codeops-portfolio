class Account:
    def __init__(self, acc_id, balance):
        self.acc_id = acc_id
        self.balance = balance

class Branch:
    def __init__(self, name):
        self.name = name
        self.children = []
        self.accounts = []
        
    def total_balance(self):
        # Sum accounts directly held in this branch
        total = sum(a.balance for a in self.accounts)
        # Recurse through all sub-branches (children)
        for child in self.children:
            total += child.total_balance()
        return total

def bfs(transfers, start):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        current = queue.pop(0)
        for recipient in transfers.get(current, []):
            if recipient not in visited:
                visited.add(recipient)
                queue.append(recipient)
                
    return visited



if __name__ == "__main__":
    head_office = Branch("Head Office")

    north_region = Branch("North Region")
    south_region = Branch("South Region")
    head_office.children.extend([north_region, south_region])
    
    branch_ny = Branch("New York Branch")
    branch_bos = Branch("Boston Branch")
    north_region.children.extend([branch_ny, branch_bos])
    
    branch_mia = Branch("Miami Branch")
    south_region.children.append(branch_mia)
    
    #Add accounts with balances to the leaves/branches
    branch_ny.accounts.extend([Account("ACC-101", 5000), Account("ACC-102", 3000)])
    branch_bos.accounts.extend([Account("ACC-103", 2500)])
    branch_mia.accounts.extend([Account("ACC-201", 10000)])
    
    print(f"Total balance under Head Office: ETB{head_office.total_balance()}")
    print(f"Total balance under North Region: ETB{north_region.total_balance()}")
    

    transfers = {
        "ACC-101": ["ACC-102", "ACC-201"],
        "ACC-102": ["ACC-103"],
        "ACC-201": ["ACC-103", "ACC-301"],
        "ACC-103": [],
        "ACC-301": ["ACC-101"]
    }
    
    start_account = "ACC-101"
    reachable_accounts = bfs(transfers, start_account)
    print(f"Accounts reachable from {start_account}: {reachable_accounts}")