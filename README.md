# Sensible Techlauncher

Gathering well-labeled data for machine learning projects can be very difficult and expensive. These days we all carry around a mobile phone which has sensors ranging from accelerometers to ambient light sensors. The goal of this project is to produce an app for Android and iOS which can harness these existing sensors for data collection. It will allow data to be labelled in real-time as well as allow selecting which sensors collect the data. The app is for educational purposes and will be very useful for machine learning students as they will not restricted to using existing data which tend to either be unlabelled or suboptimal for certain applications.

## Team Charter

You can find information about our plans, procedures, success metrics and team roles in our team charter located here: [Team Charter](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Team%20Charter/Team_Charter.pdf)

## Presentation Links

The following links will lead you to each of our audit presentation slides. The first link correlates to our most recent presentation.

[Semester 1 Audit 1 presentation](https://docs.google.com/presentation/d/1SKUfDGYnsQlZBFPRt6k_PIxHJTU7K_f_hiBQ2SD-vyE/edit)

## Decision Making

Decisions are made in our decision making channel on slack. For an overview for the major project decisions you can browse our decision log: [Decision Log](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Decision%20log/decision_log.md)

Or if you would like to see all decisions which have been made you can view our slack channel: [Decision Making Channel - Slack](https://app.slack.com/client/T01P49EES2F/C01QUENBY9E/thread/C01QUENBY9E-1615180806.003200?force_cold_boot=1)

(Please contact Ryan ASAP if you don't have access to this slack link)

## Statement of Work

You can find information about our project background, project objectives, stakeholders and work breakdown in our statement of work here : [Statement of Work](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/Statements%20of%20Work/SENSIBLE_SOW_S1_2021_SIGNED.pdf)

## User Story Map

You can see our requirements and our agreed upon MVP in our USM located here: [User Story Map](https://gitlab.cecs.anu.edu.au/u6668026/sensible-techlauncher/-/blob/master/Background%20Documentation/User%20Story%20Map/User_Story_Map.pdf)

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
