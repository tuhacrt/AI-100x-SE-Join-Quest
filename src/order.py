from typing import List, Dict


class Order:
    def __init__(self):
        self.total_amount: float = 0.0
        self.original_amount: float = 0.0
        self.discount: float = 0.0
        self.items_to_receive: List[Dict[str, any]] = []
