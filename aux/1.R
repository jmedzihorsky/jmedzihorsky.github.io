#   z values table for confidence intervals


qnorm(1-(1-95/100)/2)


ps <- 1:99

z <- qnorm(1-(1-ps/100)/2)


data.frame(ps, round(z,2))

md <- data.frame(perc=ps, mult=z)

head(md)

write.csv(md, file='intervals.csv', row.names=F)
