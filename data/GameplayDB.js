var allGameplayData =
{
	// Data per jet type
	"jet_initial_speeds":    [380, 380, 450, 470],
	"jet_max_speeds":	     [900, 1300, 1600, 1600],
	"jet_accel_rate": 	     [2.5, 2.5, 3, 4],
	"jet_fuel_drain_rate":   [0.6, 0.48, 0.45,0.35],
	"jet_fuel_collect_gain": [1, 1, 1, 1],

	// Obstacle types
	"obstacles": [
		{"id": 1, "name": "beach_rock", "type": "low", "width": 100, "height": 100, "xOffset": 50, "yOffset": 20 },
		{"id": 2, "name": "buoy", "type": "low", "width": 115, "height": 100, "xOffset": 40, "yOffset": 25 },
		{"id": 3, "name": "castle", "type": "low", "width": 105, "height": 100, "xOffset": 40, "yOffset": 10},
		{"id": 4, "name": "jungle_rock", "type": "low", "width": 120, "height": 100, "xOffset": 60, "yOffset": 30},
		{"id": 5, "name": "kite_green", "type": "high", "width": 80, "height": 100, "xOffset": 28, "yOffset":20},
		{"id": 6, "name": "kite_pink", "type": "high", "width": 80, "height": 100, "xOffset": 28, "yOffset": 20},
		{"id": 7, "name": "sea_rock", "type": "low", "width": 120, "height": 100, "xOffset": 60, "yOffset": 30},
		{"id": 8, "name": "stump", "type": "low", "width": 60, "height": 150, "xOffset": 50, "yOffset": 0},
		{"id": 9, "name": "vine", "type": "high", "width": 110, "height": 140, "xOffset": 43, "yOffset": 0}
	],

	// What obstacles in which area
	"obstacleAreas": [
		{"area": "forest", "ids": [4, 8, 9]},
		{"area": "shore", "ids": [1, 3, 5, 6]},
		{"area": "sea", "ids": [2, 5, 6, 7]},
	],
	
	// Obstacle times (in seconds)
	"obstacleTimes": {
		"start_interval": 3,
		"end_interval": 1.5,
		"decrease_rate": 0.01,
	},

	// Toucan values, in seconds, per jet type
	// -1 means no toucan for that jet
	"toucanTimes": {
		"waitFromStart": [25, 12, 8, 9],
		"spawnInterval": [14, 12, 10, 9],
	},

	// Collectable spawn chances, in general scale of chance (about 0 ~ 100), for each jet type
	"collectableTimes": {
		"fuelTimes": [8, 10, 11, 11],
		"coinTimes": [2, 1.5, 1.5, 1.3],
		"jewelTimes": [10, 14, 15, 15],
		"lifeTimes": [8, 9, 10, 13],
	},

	// Charm chance factors, multiply the above spawn chance
	"charmFactors": {
		"jewelCharm": 2,
		"lifeCharm": 2,
		"fuelCharm": 2,
	},

	// Shop prices
	"shopItems": [
		{"price": 150}, // Big Jet
		{"price": 400}, // Double Jet
		{"price": 1000}, // Space Rocket

		{"price": 400}, // 1 Life
		{"price": 600}, // 2 Lives
		{"price": 1000}, // 3 Lives

		{"price": 1000}, // Jewel Charm
		{"price": 800}, // Life Charm
		{"price": 900}, // Fuel Charm
	]
}

function GameplayDB() {
}

GameplayDB.prototype.getGameplayData= function() {
	return allGameplayData;
}