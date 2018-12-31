#!groovy

import jenkins.model.*
import hudson.security.*
import jenkins.security.s2m.AdminWhitelistRule

def instance = Jenkins.getInstance()
def env = System.getenv()

def user = env['ADMIN_USER']
def pass = env['ADMIN_PASSWORD']

if (user == null || user.equals('')) {
	logger("Environment variables 'ADMIN_USER is required for settings.")
	System.exit(1);
}

println "Creating user " + user + "..."

def hudsonRealm = new HudsonPrivateSecurityRealm(false)
	hudsonRealm.createAccount(user, pass)
	instance.setSecurityRealm(hudsonRealm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
	instance.setAuthorizationStrategy(strategy)
	instance.save()

Jenkins.instance.getInjector().getInstance(AdminWhitelistRule.class).setMasterKillSwitch(false)

println "User " + user + " was created"
