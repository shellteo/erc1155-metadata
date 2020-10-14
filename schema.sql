CREATE TABLE messages (
  id VARCHAR(64) NOT NULL,
  address VARCHAR(64) NOT NULL,
  version VARCHAR(6) NOT NULL,
  timestamp BIGINT NOT NULL,
  space VARCHAR(64),
  token VARCHAR(64),
  type VARCHAR(12) NOT NULL,
  payload JSON,
  sig VARCHAR(64) NOT NULL,
  metadata JSON,
  PRIMARY KEY (`id`),
  KEY address (address),
  KEY version (version),
  KEY timestamp (timestamp),
  KEY space (space),
  KEY token (token),
  KEY type (type)
);

CREATE TABLE hubs (
  host VARCHAR(64) NOT NULL,
  address VARCHAR(64),
  is_self INT DEFAULT 0,
  is_active INT DEFAULT 1,
  PRIMARY KEY (`host`),
  KEY address (address),
  KEY is_self (is_self)
);

CREATE TABLE project (
  id INT NOT NULL AUTO_INCREMENT,
	blockchain VARCHAR(64) NOT NULL,
	name VARCHAR(64) NOT NULL,
	logo VARCHAR(255) NOT NULL,
	brief MEDIUMTEXT NOT NULL,
	intro MEDIUMTEXT NOT NULL,
	contract_address VARCHAR(255) NOT NULL,
	contract_totalsupply VARCHAR(255) NOT NULL,
	contract_audit VARCHAR(255) DEFAULT NULL,
	contract_audit_report VARCHAR(255) DEFAULT NULL,
	website VARCHAR(255) NOT NULL,
	sort INT DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE mining (
  id INT NOT NULL AUTO_INCREMENT,
	pid INT NOT NULL,
	symbol VARCHAR(64) NOT NULL,
	url VARCHAR(255) NOT NULL,
	amount VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE resource (
  id INT NOT NULL AUTO_INCREMENT,
	pid INT NOT NULL,
	name VARCHAR(64) NOT NULL,
	url VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);
