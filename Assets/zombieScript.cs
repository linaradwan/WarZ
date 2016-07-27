using UnityEngine;
using System.Collections;

public class zombieScript : MonoBehaviour {

	protected Animator myAnimator;
	// Use this for initialization
	void Start () {
		myAnimator = GetComponent<Animator>();
	}
	
	// Update is called once per frame
	void Update () {
		myAnimator.SetFloat("speed", Input.GetAxis("Vertical"));
	}
}
