using UnityEngine;
using System.Collections;

public class GameMangement : MonoBehaviour {
	public int round=1;
	int zombiesInRound=10;
	int zombiesSpawnedInRound=0;
	float zombiesSpawnTimer=0;
	public Transform[] zombieSpawnPoints;
	public GameObject zombieEnemy;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void FixedUpdate () {
		if (zombiesSpawnedInRound < zombiesInRound) {
			if (zombiesSpawnTimer > 30) {
				SpawnZombie ();
				zombiesSpawnTimer = 0;
			} else {
				zombiesSpawnTimer++;
			}
		}

}

	void SpawnZombie(){
		Vector3 randomSpawnPoint = zombieSpawnPoints [Random.Range (0, zombieSpawnPoints.Length)].position;
		Instantiate (zombieEnemy, randomSpawnPoint, Quaternion.identity);
		zombiesSpawnedInRound++;
	}
}
