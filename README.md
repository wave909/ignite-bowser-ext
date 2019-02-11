# Wave909 React Native code demo

https://github.com/infinitered/ignite-bowser

## Key practices
### git submodule 
Add [a submodule](https://github.com/wave909/react-native-components) with common logic, desgined for rapid development and integration of shared components.

When used in private settings, it is advised to name submodule branches with the project names/issue tracker prefixes.

Example:
```
$ git branch -r
  origin/ECOMM
  origin/CHAT
  origin/some-specific-project
```

Internal wikis (such as Confluence) will then serve as a reference for developers to understand the meaning behind new code.
This allows for better discerning of project-specific vs. commonplace solutions. 

⚠️ Don't forget to pull the dependency after checking out this project!

```git submodule update --init```

# TODO
- [ ] Share tslint.json, document all the reasoning behind the policies
- [ ] Use the Ignite boilerplate generator to add the submodule and configure CI/CD
- [ ] Host a TODO backend, demonstrate common error handling (such as the 401 redirect)
