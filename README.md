
# Chronodex

*A minimalist, customisable Chronodex planner for your New Tab page*

![screenshot](https://raw.githubusercontent.com/She110ck/chronodex/main/chronodex-1200.png)

## Intro
If you also wanted to visualize your whole day in one place, this extension is for you. 

## Usage
Delivery to chrome web store in progress. For now you can install locally

1. Clone repo
```
git clone https://github.com/She110ck/chronodex.git

```
2. Load extension  
```
Chrome -> Manage extensions -> Developer mode -> Load unpacked
```
## Publishing
```
zip -r chronodex.zip css icons manifest.json LICENSE scripts index.html
```

## Future improvements
[x] Change ugly settings panel design.  
[ ] Update state management. I don't like segment and list of title interraction.  
[ ] Dark mode.   
[ ] 12 hour clock numbers(I prefer 24 hour, but good to have a choice), non rotated clock numbers.  
[ ] Exclude from canvas second clock hand and use html(or svg) with transition. It will make hand movement smooth. Making smooth via canvas have inappropriately high CPU usage.  
[ ] Ability to reorder on title list.    
[ ] Regenerate random color.  
  
> Any other improvements appreciated.

## FAQ
**Q: Why did you use canvas?**  
**A:** Only because I didn't have any experience earlier. I think svg would be much easier and resouce intensive.  
**Q: How I can extract my timing setup?**  
**A:** Right now you can't. Was possible to implement add syncronization between devices if you logged as same user.But didn't test on other chrome based browsers. If you need it, just let me know. 


