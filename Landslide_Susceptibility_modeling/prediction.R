setwd("") #set the working directory

####### Packages #####
packages = c('mgcv','dplyr', 'parallel')
installed_packages = packages %in% rownames(installed.packages())
if (any(installed_packages == FALSE)) {
  install.packages(packages[!installed_packages])
}

invisible(lapply(packages, library, character.only = TRUE))

####### Input data #####
load("data_input/data.Rda")
model=readRDS("GAMmodel.rds")

####### Pre processing #####
data$zones=as.factor(data$Country)
data$Litho=as.factor(data$litho)
data$plan_max[data$plan_max > 15] = 15
data$prof_mean[data$prof_mean< -0.0018] = -0.0018
data$prof_mean[data$prof_mean> 0.0012] = 0.0012
data$dis_aFault[data$dis_aFault>2500]=2500

####### Prediction #######

myexclude=c("s(infra_len)","s(zones)")

susc_biased=predict.bam(model,data,type='response')
susc_unbiased=predict.bam(model,data,type="response",exclude=myexclude)


plot(density(susc_biased),col='red',ylim=c(0,40))
lines(density(susc_unbiased),col='blue')

###### Export susceptibility scores ######

susc=cbind(data,susc_unbiased,susc_biased)
susc_clean=susc[c('Zone','ID','susc_unbiased','susc_biased')]

write.csv(susc_clean,"data_output/prediction/susceptibility.csv",row.names=FALSE)


