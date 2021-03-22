# Sensible Techlauncher

## Team Roles

* Ryan Turner (u6040885) Project Manager
* Madeleine Carden (u5849803) Client Liason 
* King Ho Cheung (u6181123) Presentation Manager, iOS frontend developer
* Ian Oxborrow (u6668026) Documentation Manager
* Chathura Galappaththi (u6947345) Android frontend developer
* Tristan Smith (u6949592) Backend Developer

\* Team roles are subject to change as the project development progresses

## Presentation Links

[Semester 1 Audit 1 presentation](https://docs.google.com/presentation/d/1SKUfDGYnsQlZBFPRt6k_PIxHJTU7K_f_hiBQ2SD-vyE/edit)

## 30 Second Pitch
Gathering well-labeled data for machine learning projects can be very difficult and expensive. These days we all carry around a mobile phone which has sensors ranging from accelerometers to ambient light sensors. The goal of this project is to produce an app for Android and iOS which can harness these existing sensors for data collection. It will allow data to be labelled in real-time as well as allow selecting which sensors collect the data. The app is for educational purposes and will be very useful for machine learning students as they will not restricted to using existing data which tend to either be unlabelled or suboptimal for certain applications.

## Project Background

The aim of the project is to develop a smartphone application which will collect, store and transmit the data from all available sensors of a given smartphone (e.g. accelerometers, thermometer, gyroscope, barometer, camera, microphone etc). Although similar apps exist, none of them provides the option to log any sensor, mostly the camera and/or microphone are missing and need seperate apps to be logged.

## Project Objectives

The app needs to be compatible with different smartphone operating systems (Android, iOS) and versions. The app needs to provide the following additional features:  
&nbsp; i) select the sampling rate of the data logging per sensor  
&nbsp; ii) log multiple sensors simultaneously  
&nbsp; iii) automatically store data on cloud/be able to transfer the data to a computer  
Additionally, the app should include an annotation feature. This feature will permit to define a data tag while the logging is running (e.g. biking if the person is biking during the data log). More than one tag should be able to be assigned during the course of the registration without interrupting the process. Such a feature does not exist in available apps and is crucial for facilitating annotated data collection.

The outcome of this project is the development of a consistent tool, accessible to everyone, to harvest the rich data available in modern smartphones with the aim to enable the design and development of machine learning (ML) applications. In particular, we envision to make use of this app in order to launch tutorials and tasks to enhance ML courses in the school of Comptuting with practical ML development exercises and projects. Moreover, we expect that this app will be also useful for ML training and research purposes for Honours and HDR students.

## Stakeholders
Primary project owner: DR ELENI DASKALAKI

Other project owners/Focus group of users: CHIRATH HETTIARACHCHI, SANDARU SENEVIRATNE, ROBIN VLIEGER

Project team: IAN OXBORROW, MADELEINE CARDEN, MICHAEL CHEUNG, RYAN TURNER, TRISTAN SMITH, CHATHURA GALAPPATHTHI

Examiner: PRISCILLA KAN JOHN

Tutor: ANDREA PARSONS

Shadow team: ARSHUTOSH PAUDEL, JOSHUA KUMMEROW, KISHOR J, KIT YEO, LAWRENCE FLINT, RANJTH RAJ, HARISH KALIYAPERUMAL

User groups: STUDENTS, RESEARCHERS, HOBBYISTS

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
