# 1. Single Responsibility Principle (SRP)
class ReportBuilder:
    def build_report(self):
        return "Report Content"

class ReportSaver:
    def save_to_file(self, content):
        pass

class ReportEmailer:
    def email_report(self, content):
        pass


# 2. Open/Closed Principle (OCP)
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def calculate_area(self):
        pass

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def calculate_area(self):
        return self.w * self.h

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def calculate_area(self):
        return 3.14 * self.r * self.r


# 3. Singleton Pattern
class AppSettings:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance


# 4. Factory Pattern
class Square(Shape):
    def __init__(self, s):
        self.s = s
    def calculate_area(self):
        return self.s * self.s

class Triangle(Shape):
    def __init__(self, b, h):
        self.b, self.h = b, h
    def calculate_area(self):
        return 0.5 * self.b * self.h

class ShapeFactory:
    @staticmethod
    def create(kind, *args):
        if kind == "circle":
            return Circle(*args)
        if kind == "square":
            return Square(*args)
        if kind == "triangle":
            return Triangle(*args)
        raise ValueError(f"Unknown shape: {kind}")


# 5. Observer Pattern
class NewsAgency:
    def __init__(self):
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def notify(self, news):
        for obs in self._observers:
            obs.update(news)

class EmailSubscriber:
    def update(self, news):
        print(f"Email received: {news}")

class PushSubscriber:
    def update(self, news):
        print(f"Push alert: {news}")


# --- Verification Code ---
if __name__ == "__main__":
    # Test Singleton
    s1, s2 = AppSettings(), AppSettings()
    print(s1 is s2, s1.currency)

    # Test Factory
    shape = ShapeFactory.create("circle", 5)
    print(shape.calculate_area())

    # Test Observer
    agency = NewsAgency()
    agency.subscribe(EmailSubscriber())
    agency.subscribe(PushSubscriber())
    agency.notify("Breaking News!")