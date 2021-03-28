# Sensible Techlauncher

Gathering well-labeled data for machine learning projects can be very difficult and expensive. These days we all carry around a mobile phone which has sensors ranging from accelerometers to ambient light sensors. The goal of this project is to produce an app for Android and iOS which can harness these existing sensors for data collection. It will allow data to be labelled in real-time as well as allow selecting which sensors collect the data. The app is for educational purposes and will be very useful for machine learning students as they will not be restricted to using existing applications which tend to either not allow labelling or don't allow the selection of sensors.

## Team Charter

You can find information about our plans, procedures, success metrics and team roles in our team charter located here: [Team Charter](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Team%20Charter/Team_Charter.pdf)

Our team charter gives an overview of many documents which are vital to our project's success. Links to each of theses documents mentioned can be found below.

## Presentation Links


The following links will lead you to each of our audit presentation slides. The first link correlates to our most recent presentation.

[Semester 1 Audit 2 presentation](https://prezi.com/view/ZERGlkC2WHuHI8OIEryB/)

[Semester 1 Audit 1 presentation](https://docs.google.com/presentation/d/1SKUfDGYnsQlZBFPRt6k_PIxHJTU7K_f_hiBQ2SD-vyE/edit)

## Statement of Work

You can find information about our project background, project objectives, stakeholders and work breakdown in our statement of work here: [Statement of Work](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Statements%20of%20Work/SENSIBLE_SOW_S1_2021_SIGNED.pdf)

## Decision Making and reflection

Decisions are made in our decision making channel on slack. For an overview for the major project decisions you can browse our decision log: [Decision Log](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Decision%20log/decision_log.md)

Or if you would like to see all decisions which have been made you can view our slack channel: [Decision Making Channel - Slack](https://app.slack.com/client/T01P49EES2F/C01QUENBY9E/thread/C01QUENBY9E-1615180806.003200?force_cold_boot=1)

(Please contact Ryan ASAP if you don't have access to this slack link)

When making decisions about feedback recieved, we store our reflection and learning in feedback tables here: [Reflection Tables](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/tree/master/Background%20Documentation/Reflection)

## Boards for assignment of work

To assign tasks to everyone and show the estimated hours the task needed we use Gitlab boards here: [Boards](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/boards)

## Communication

To communicate our understanding of the project requirements to our stakeholders we have created a user story map here: [User Story Map](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/User%20Story%20Map/User_Story_Map.pdf)

After discussion with our stakeholders, we have created an updated User Story Map which only focuses on the Minimum Viable Product here: [MVP](https://miro.com/app/board/o9J_lMgCf9M=/)

To communicate the UI design of our application we have created some screen designs located here: [Screen Designs](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/tree/master/Background%20Documentation/Screen%20Designs)

To view our communication plan you can visit the following link: [Communication Plan](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Communication%20plan/communication%20plan.pdf)

To keep track of the communication at meetings we have kept minutes of all client meetings, team meetings and tutorials here: [Meeting Minutes](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/tree/master/Background%20Documentation/Meeting%20Minutes)

## Risk

To see how our team is mitigating risks and plans for when issues occur, you can view our risk register here: [Risk Register](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Risk%20register/risk%20register.pdf)

# Prototypes and Releases

You can find each prototype and release of our project here: [Graphing Preview](LINK)

You can find our Burdown Chart documenting our estimated and actual progress on the project here: [Burndown Chart](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Burndown%20Chart/Burndown_Chart_28-03.pdf)

# System Documentation

Our Design Class Diagram can be found here: [DCD](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Design%20Class%20Diagram/Design_Class_Diagram.pdf)

Our Data Flow Diagram can be found here: [DFD](https://miro.com/app/board/o9J_lMhNxwo=/?userEmail=u5849803@anu.edu.au&track=true&utm_source=notification&utm_medium=email&utm_campaign=add-to-board&utm_content=go-to-board)

Our Domain Model can be found here: [DM](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Domain%20Model/Domain%20Model.pdf)

# FAQ

## What does this app offer that existing solutions don't?

The Sensible project differs from existing smartphone sensor apps in two key ways: Labelling data
**during** collection, and deliberately seeking to offer maximum sensor coverage. Most apps that allow
the user to record sensor data do not try to support the widest array of sensors available on the device, and they provide no way for the user to label the data during collection, if at all.

## Who is the app intended to be used by and what is it for?

The app is being created with students in mind, but it is our intention that anyone looking for an easy way to create labelled datasets for machine learning or data analysis would find it suitable for that purpose.

## How does this app ensure user data security?

Data collected from a phone's sensors will be stored locally, accessible only to the owner of the device lest they choose to share it via a third party platform. The app will not transmit
any collected data without the user's knowledge; as the project is open source, this fact will always
remain verifiable.

## Which devices is this app compatible with and what sensors are supported?

The app will be compatible with any android or iOS device capable of running a currently supported version of their respective operating systems. The ultimate aim of the app is to provide access to as many sensors as possible on a particular device, hence precisely which sensors are available will vary between devices.
