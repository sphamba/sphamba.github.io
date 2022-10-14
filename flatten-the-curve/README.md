
# Flatten the Curve

## Description

This project is an online presentation with interactive slides that teaches you what is the SIR model. It lets you play with its parameters, which is the best way to understand it. The SIR model is extended to show the effect of individual or global initiative on the evolution of an epidemic.

The presentation is divided into three parts. The first one defines the concept of _the Curve_ of Infected people over time. The second one shows several ways to decrease the height of _the Curve_, and the last part explains why this is important.

Finally, the user can play with the full interactive model to understand the (simplified) mechanics of disease propagation.

This project was made during the LauzHack Against COVID-19 Hackaton in April 2020.

## Model details

### Differential equations

The governing equations are:

$$
\begin{align}
\frac{dS}{dt} &= \frac{1}{d_R}R-c(t)p_IIS \\
\frac{dI}{dt} &= c(t)p_IIS-\left(1-\frac{1}{d_I}\right)\frac{1}{d_H}I-\frac{1}{d_I}I \\
\frac{dH}{dt} &= \left(1-\frac{1}{d_I}\right)\frac{1}{d_H}I-\frac{1}{d_I}H \\
\frac{dR}{dt} &= \frac{1}{d_I}(1-p_D)I+\frac{1}{d_I}(1-p_{H\rightarrow D})H-\frac{1}{d_R}R \\
\frac{dD}{dt} &= \frac{1}{d_I}p_DI+\frac{1}{d_I}p_{H\rightarrow D}H \\
H &\leq H_\text{max} \\
S(0) &= 1-I_0,I(0)=I_0,H(0)=R(0)=D(0)=0 \\
\end{align}
$$

with the parameters:
- $c(t)$: number of contacts per unit time
- $p_I$: infection probability
- $d_I$: infection duration
- $p_D$: lethality
- $d_H$: time before hospitalization
- $p_{H\rightarrow D}$: lethality in hospital
- $d_R$: immunity duration
- $I_0$: initial contamination
- $H_\text{max}$: hospital capacity

Time is expressed in days and other quantities as percentages of the whole population.

### Numerical integration

The [Bodacki-Shampine method](https://en.wikipedia.org/wiki/List_of_Runge%E2%80%93Kutta_methods#Bogacki%E2%80%93Shampine) is used to compute from $y_n$ at time $t$: an estimate $y_{n+1}$: at time $t+h$: with order 3 and an estimate of the error (for adaptive stepsize) with order 2. The precision is set to $10^{-5}$: with safety factor $0.9$: and the minimum and maximum stepsizes are respectively $0.05$: and $20$.

## Try it

The presentation is accessible [here](https://soni-sona.github.io/flatten-the-curve/index.html).
