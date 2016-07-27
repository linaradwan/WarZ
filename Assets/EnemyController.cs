using UnityEngine;
using System.Collections;

public class EnemyController : MonoBehaviour {
	NavMeshAgent nav;
	Transform player;
	float health;
	GameMangement game;
	CapsuleCollider capsuleCollider;
	Animator animation;
	bool isDead=false;
	// Use this for initialization
	void Awake () {
		nav = GetComponent<NavMeshAgent> ();
		player = GameObject.FindGameObjectWithTag ("Player").transform;
		game = FindObjectOfType<GameMangement>();
		health = 20 + (1.25F * game.round);
		capsuleCollider = GetComponent<CapsuleCollider> ();
		animation = GetComponent<Animator>();
	}
	
	// Update is called once per frame
	void Update () {
		if (!isDead) {
			
			nav.SetDestination (player.position);
		}
	}

	void ApplyDamage(float damage){
		health -= damage;
		if (health < 0)
			Death ();

		}

	void Death(){
		isDead = true;
		nav.Stop ();
		animation.SetTrigger ("isDead");
		capsuleCollider.isTrigger = true; 
	//	GameMangement.score += 10;
	//	GameMangement.money += 10;
		Destroy (gameObject, 4f);
	}
}
