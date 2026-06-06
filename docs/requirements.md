Wealth Platform

# Overview

I want to build a wealth platform that I called Aegis as a working title. The idea is to have a monorepo for the frontend where all of the applications will live and will be managed by LLMs for feature development therefore will require plenty of markdown documentation to make sure that the architecture, design methodology and features are all captured and organised for easy access by LLMs even after context clearing. 

The platform will have live applications as well as prototype applications built by various team utilising LLM instructions to follow best practices and simplest integration - purpose of this is to demonstrate to peers what the potential applications or functions could look like to see the big picture before it is complete and to allow for rapid iteration on design

## Target audience
Client - later stage, but meaning external access and permissions are top priority as well as personas)
Relationship Managers
Investment Manager
Portfolio Managers
Structured Product Investment Team
Trading Team
Operations Team
Compliance Team
Quant Team
Later more teams will be added

## Features
Global search across Applications, Functions and Entities - defined later
Role based visibility
Context passing between applications
Workspaces for switching state
Shareable context
V1 to have data using mocked services (defined in Data section)
Actions (think things assigned to you that draws your attention to an area of the platform)

## Definitions

### Application
I want to build a PMS, OMS etc. but I want you to work with me on defining if it’s for example a PMS as an app, or set of functions that make a PMS workflow. 

### Functions
A function is for example universe builder (which should be part of PMS and other applications as well, whatever app needs it) so you can think about it as a composable piece of an application

### Entities
Any asset like a portfolio, client, bond etc. as well as contacts - there will be a lot so searches have to be contextual and relevant 

## Global Search Bar
We want the users to be able to search across the app and the search be smartly organised based on the previous definitions we defined

## Technology
Turborepo
Pnpm
React
Tanstack query + router
Shadcn components 
zod
zustand
Major compatible versions, well researched ahead
Rest to be discussed as the need arrises

## Testing
Unit + e2e required - we start with basic unit and move onto e2e towards end phases

## Architecture
Core (logger etc.)
Core Models/Entities (common wealth models like portfolio etc.)
Applications / functions segregated by folders/namespaces
Data access segregated by domain scoped packages
Strong preference for SDK over API and HTTP Client access
Preference for well proven technologies working well with LLMs for simplicity and speed of development

## Data
Mocked data via mock APIs, exposed in packages acting like SDKs

## Mocked applications
Brief note about these - we will discuss in detail once v1 is complete
PMS and OMS
We want to show portfolio management for different client accounts for different portfolios that they hold - single and multiple accounts and portfolios
Order from PMS flowing to OMS
OMS to execution and status visible in PMS and OMS on orders
Simulated compliance, suitability, mandate and other OMS checks in PMS and OMS
Universe of assets (search, filtering etc.) - building a portfolio or adding to existing portfolio
Weight based rebalancing

## Build approach
Carefully planned build out with well documented phases that allow for any LLM to know of the current status and what is next
Phases committed to git
Phases need to have human testable elements i.e. no pure background changes like SDK improvements etc. (tracer bullets)
V1 is working platform with all features implemented
V2 will be a separate session where we work on testing out a mocked application