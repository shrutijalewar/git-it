#!/usr/bin/env node

var exec = require('child_process').exec

// get their username
// verify branch matches username
// // verify that they've put their file in the right dir
// verify they've pushed

exec('git config user.username', function(err, stdout, stdrr) {
  var username = stdout.trim()

  exec('git status', function(err, stdout, stderr) {
    var branch = stdout.trim().toLowerCase()
    var branchName = "add-" + username.toLowerCase()
    exec('git reflog show origin/' + branchName, function(err, stdout, stderr) {

      var ref = stdout.trim()
      if (branch.match(branchName)) {
        // branch name is correct
        // check file dir is correct
        exec('git log --name-only --oneline', function(err, stdout, stdrr) {
          if (!stdout.match('contributors/')) {
            // it's NOT in right dir
            return console.log("Oops, looks like your file isn't in\n" +
            "the 'contributors' folder! Move it and commit again.")
          } else {
            if (stdout.toLowerCase().match('add-' + username.toLowerCase())) {
              // filename is correct
              console.log("Changes have been committed!")
            } else {
              console.log("Filename was expected to be\nadd-" + username)
            }
          }
        })

        console.log("Found the branch as expected!")

      } else {
        console.log("branch name was not:\n'" + branchName + "'")
      }

      if (ref.match("update by push")) console.log("Changes have been pushed!")
      else console.log("Changes not pushed")

    })
  })
})
