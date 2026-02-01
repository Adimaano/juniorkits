Generate web application fulfilling following requirements.

# Stack
A monolithic Software Application with a single frontend in a React Framework.

# Style Guide
Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. 
Implement real working code with exceptional attention to aesthetic details and creative choices.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

# Project Context
A professional movie production and photo studio company, requires an online interface to manage, monitor and track their equipment and gear inventory for the upcoming jobs.

# Design System
The archtiecture and overall UX Design of the Software shall revolve around the entities

class Equipment()

it shall have the following attributes:
- shortName # short and descriptive name
- fullName # may contain manufacturers, modelnumber etc.
- value # MSRP of the equipment, price to buy a new one.
- defects # a list of tracked damages, defects etc.
- howMany # number of times available, in case of consumable items.
- buy-date # date item has been aquired to account of age, usage.
- notes # a freeform string for any additional description or notes.
- status # should depict states such as NEW, OLD, DAMAGED, UNAVAILABLE etc.

class Job()

it shall have the following attributes:
- date # When the job is happening
- location # where the job is happening
- price # how much is expected to be paid out
- gear # a list of Equipment() required for the job

# Feature list
- A login page with a secret passcode.
    - the passcode should be: "joopie".
On as succesful login:
- a tab named "Jobs" should depict a calender of a monthly view.
    - the User may add, delete and edit job events in the calender.
    - this calender should highlight upcoming job events.
    - clicking on an event the user can view the Event name, location, job description 
    and most importantly an interactive check-list of required equipments. This is the critical business logic! Its important for the User to a) know what is required for each job b) know if he has it available and packed. 
- a tab named "Inventory" depicting the full current inventory of the company. 
    - Here the User can add, delete and edit individual gear.


