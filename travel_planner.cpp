#include <iostream>
#include <string>
using namespace std;

// ---------------- USER ----------------
class User {
private:
    string name;
    double budget;
    int days;

public:
    User(string n, double b, int d) {
        name = n;
        budget = b;
        days = d;
    }

    double getBudget() { return budget; }
    int getDays() { return days; }
    string getName() { return name; }
};

// ---------------- DESTINATION ----------------
class Destination {
private:
    string name;

public:
    Destination(string n) {
        name = n;
    }

    string getName() { return name; }
};

// ---------------- TRANSPORT (ABSTRACT) ----------------
class Transport {
public:
    virtual double calculateCost() = 0;
    virtual string getType() = 0;
};

// ---------------- TRANSPORT TYPES ----------------
class Flight : public Transport {
    double price;
public:
    Flight(double p) { price = p; }

    double calculateCost() { return price; }
    string getType() { return "Flight"; }
};

class Train : public Transport {
    double price;
public:
    Train(double p) { price = p; }

    double calculateCost() { return price; }
    string getType() { return "Train"; }
};

class Bus : public Transport {
    double price;
public:
    Bus(double p) { price = p; }

    double calculateCost() { return price; }
    string getType() { return "Bus"; }
};

// ---------------- HOTEL ----------------
class Hotel {
private:
    string type;
    double pricePerNight;

public:
    Hotel(string t, double p) {
        type = t;
        pricePerNight = p;
    }

    double getPrice() { return pricePerNight; }
    string getType() { return type; }
};

// ---------------- MAIN ----------------
int main() {
    string name, destName;
    double budget;
    int days, choice;

    cout << "=== Smart Travel Planner ===\n\n";

    cout << "Enter your name: ";
    getline(cin, name);

    cout << "Enter your budget (Rs): ";
    cin >> budget;

    cout << "Enter number of days: ";
    cin >> days;

    cin.ignore();

    cout << "Enter destination: ";
    getline(cin, destName);

    cout << "\nChoose Preference:\n";
    cout << "1. Budget Friendly\n2. Balanced\n3. Luxury\n";
    cout << "Enter choice: ";
    cin >> choice;

    User user(name, budget, days);
    Destination dest(destName);

    // Transport objects
    Flight flight(8000);
    Train train(3000);
    Bus bus(1500);

    // Hotels
    Hotel budgetHotel("Budget", 1000);
    Hotel standardHotel("Standard", 2000);
    Hotel luxuryHotel("Luxury", 4000);

    double bestCost = 1e9;
    string bestTransport = "", bestHotel = "";

    // ---------------- LOGIC ----------------

    Transport* transports[3] = { &flight, &train, &bus };
    Hotel hotels[3] = { budgetHotel, standardHotel, luxuryHotel };

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {

            double total = transports[i]->calculateCost() +
                           (hotels[j].getPrice() * user.getDays());

            if (total <= user.getBudget()) {

                // 🎯 PREFERENCE FILTER
                if (choice == 3) { // Luxury
                    if (transports[i]->getType() != "Flight" ||
                        hotels[j].getType() != "Luxury")
                        continue;
                }
                else if (choice == 2) { // Balanced
                    if (transports[i]->getType() != "Train" ||
                        hotels[j].getType() != "Standard")
                        continue;
                }

                if (total < bestCost) {
                    bestCost = total;
                    bestTransport = transports[i]->getType();
                    bestHotel = hotels[j].getType();
                }
            }
        }
    }

    // fallback
    if (bestCost == 1e9) {
        cout << "\nNo plan fits your preference. Showing best available...\n";

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {

                double total = transports[i]->calculateCost() +
                               (hotels[j].getPrice() * user.getDays());

                if (total <= user.getBudget() && total < bestCost) {
                    bestCost = total;
                    bestTransport = transports[i]->getType();
                    bestHotel = hotels[j].getType();
                }
            }
        }
    }

    // ---------------- OUTPUT ----------------
    if (bestCost == 1e9) {
        cout << "\n❌ No plan fits your budget.\n";
    } else {
        cout << "\n✨ Best Travel Plan ✨\n";
        cout << "Name: " << user.getName() << endl;
        cout << "Destination: " << dest.getName() << endl;
        cout << "Transport: " << bestTransport << endl;
        cout << "Hotel: " << bestHotel << endl;
        cout << "Total Cost: Rs " << bestCost << endl;
    }

    return 0;
}