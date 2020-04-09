
# Flatten the Curve

## Description

This project is an online presentation with interactive slides that teaches you what is the SIR model. It lets you play with its parameters, which is the best way to understand it. The SIR model is extended to show the effect of individual or global initiative on the evolution of an epidemic.

The presentation is divided into three parts. The first one defines the concept of _the Curve_ of Infected people over time. The second one shows several ways to decrease the height of _the Curve_, and the last part explains why this is important.

Finally, the user can play with the full interactive model to understand the (simplified) mechanics of disease propagation.

This project was made during the LauzHack Against COVID-19 Hackaton in April 2020.

## Model details

### Differential equations

The governing equations are:

![\displaystyle\frac{dS}{dt}=\frac{1}{d_R}R-c(t)p_IIS](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%5Cfrac%7BdS%7D%7Bdt%7D%3D%5Cfrac%7B1%7D%7Bd_R%7DR-c(t)p_IIS)

![\displaystyle\frac{dI}{dt}=c(t)p_IIS-\left(1-\frac{1}{d_I}\right)\frac{1}{d_H}I-\frac{1}{d_I}I](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%5Cfrac%7BdI%7D%7Bdt%7D%3Dc(t)p_IIS-%5Cleft(1-%5Cfrac%7B1%7D%7Bd_I%7D%5Cright)%5Cfrac%7B1%7D%7Bd_H%7DI-%5Cfrac%7B1%7D%7Bd_I%7DI)

![\displaystyle\frac{dH}{dt}=\left(1-\frac{1}{d_I}\right)\frac{1}{d_H}I-\frac{1}{d_I}H](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%5Cfrac%7BdH%7D%7Bdt%7D%3D%5Cleft(1-%5Cfrac%7B1%7D%7Bd_I%7D%5Cright)%5Cfrac%7B1%7D%7Bd_H%7DI-%5Cfrac%7B1%7D%7Bd_I%7DH)

![\displaystyle\frac{dR}{dt}=\frac{1}{d_I}(1-p_D)I+\frac{1}{d_I}(1-p_{H\rightarrow D})H-\frac{1}{d_R}R](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%5Cfrac%7BdR%7D%7Bdt%7D%3D%5Cfrac%7B1%7D%7Bd_I%7D(1-p_D)I%2B%5Cfrac%7B1%7D%7Bd_I%7D(1-p_%7BH%5Crightarrow%20D%7D)H-%5Cfrac%7B1%7D%7Bd_R%7DR)

![\displaystyle\frac{dD}{dt}=\frac{1}{d_I}p_DI+\frac{1}{d_I}p_{H\rightarrow D}H](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%5Cfrac%7BdD%7D%7Bdt%7D%3D%5Cfrac%7B1%7D%7Bd_I%7Dp_DI%2B%5Cfrac%7B1%7D%7Bd_I%7Dp_%7BH%5Crightarrow%20D%7DH)

![\displaystyle H\leq H_\text{max}](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%20H%5Cleq%20H_%5Ctext%7Bmax%7D)

![\displaystyle S(0)=1-I_0,I(0)=I_0,H(0)=R(0)=D(0)=0](https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle%20S(0)%3D1-I_0%2CI(0)%3DI_0%2CH(0)%3DR(0)%3DD(0)%3D0)

with the parameters:
- ![c(t)](https://render.githubusercontent.com/render/math?math=c(t)): number of contacts per unit time
- ![p_I](https://render.githubusercontent.com/render/math?math=p_I): infection probability
- ![d_I](https://render.githubusercontent.com/render/math?math=d_I): infection duration
- ![p_D](https://render.githubusercontent.com/render/math?math=p_D): lethality
- ![d_H](https://render.githubusercontent.com/render/math?math=d_H): time before hospitalization
- ![p_{H\rightarrow D}](https://render.githubusercontent.com/render/math?math=p_%7BH%5Crightarrow%20D%7D): lethality in hospital
- ![d_R](https://render.githubusercontent.com/render/math?math=d_R): immunity duration
- ![I_0](https://render.githubusercontent.com/render/math?math=I_0): initial contamination
- ![H_\text{max}](https://render.githubusercontent.com/render/math?math=H_%5Ctext%7Bmax%7D): hospital capacity

Time is expressed in days and other quantities as percentages of the whole population.

### Numerical integration

The [Bodacki-Shampine method](https://en.wikipedia.org/wiki/List_of_Runge%E2%80%93Kutta_methods#Bogacki%E2%80%93Shampine) is used to compute from ![y_n](https://render.githubusercontent.com/render/math?math=y_n) at time ![t](https://render.githubusercontent.com/render/math?math=t) an estimate ![y_{n+1}](https://render.githubusercontent.com/render/math?math=y_%7Bn%2B1%7D) at time ![t+h](https://render.githubusercontent.com/render/math?math=t%2Bh) with order 3 and an estimate of the error (for adaptive stepsize) with order 2. The precision is set to ![10^{-5}](https://render.githubusercontent.com/render/math?math=10%5E%7B-5%7D) and the minimum and maximum stepsizes are respectively ![0.05](https://render.githubusercontent.com/render/math?math=0.05) and ![20](https://render.githubusercontent.com/render/math?math=20).

## Try it

The presentation is accessible [here](https://soni-sona.github.io/flatten-the-curve/index.html).
