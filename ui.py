import tkinter as tk

# Main window initialization
window = tk.Tk()

# Version menus initialization
versions = [
    "1.3",
    "1.7",
    "1.8",
    "1.9",
    "1.10",
    "3.0",
    "3.2",
    "3.3",
    "3.4",
    "3.5"
]
# old version menu
old_choice = tk.StringVar(window)
old_choice.set(versions[0])
old_menu = tk.OptionMenu(window, old_choice, *versions)
old_menu.pack()
# target version menu
new_choice = tk.StringVar(window)
new_choice.set(versions[0])
new_menu = tk.OptionMenu(window, new_choice, *versions)
new_menu.pack()
# search button
def search():
    old_ver = old_choice.get()
    new_ver = new_choice.get()
    if versions.index(old_ver) >= versions.index(new_ver):
        print("Error: Target version cannot be older or equal to previous version")
button_go = tk.Button(window, text="Go", command=search)
button_go.pack()

window.mainloop()
