using UnityEngine;
using System.Collections;

public class MysteryBoxScript : MonoBehaviour {
	Animator controller;
	Animation animate;
	public bool openBox = false, boxIsOpen, boxIsClosing;

	public GameObject[] guns;

	public int selectedWeapon = 0;
	public float timer;
	public int counter, counterCompare;
	public Transform gunPosition;

	// Use this for initialization
	void Start () {
		controller = GetComponentsInChildren<Animator>()[0];
		animate = GetComponentsInChildren<Animation>()[0];

	}
	
	// Update is called once per frame
	void FixedUpdate () 
	{
		if(openBox)
		{
			openBox = false;
			OpenMysteryBox();
		}
		if((controller.GetCurrentAnimatorStateInfo(0).IsName("LidOpen")) || animate.IsPlaying("liftAnim"))
		{
			timer += Time.deltaTime;
			boxIsOpen = true;
			if(timer < 4.0f && counter < counterCompare)
			{
				counter++;

			}
			else if (counter == counterCompare)
			{
				counter = 0;
				RandomizeWeapon();
				counterCompare++;
			}
			guns[selectedWeapon].transform.position = gunPosition.transform.position;
		}
		else if(boxIsOpen)
		{
			CloseLid();
			counter = 0;
			counterCompare = 0;
			timer = 0;

		}
		else if(boxIsClosing)
		{
			/*if(!controller.animation.IsPlaying("LidClose"))
			{
				boxIsClosing = false;
				boxIsOpen = false;

			}*/
		}
	}

	public void OpenMysteryBox()
	{
		OpenLid ();
		RunGunMovement();

	}

	void OpenLid()
	{
		controller.Play("LidOpen");
	}

	void CloseLid()
	{
		controller.Play("LidClose");
		boxIsClosing = true;
	}
	
	void RunGunMovement()
	{
		animate.Play ();
	}
	void RandomizeWeapon()
	{

		int rand = Random.Range(0, guns.Length);
		while(rand == selectedWeapon)
		{
			rand = Random.Range(0, guns.Length);
		}
		selectedWeapon = rand;


		for(int i = 0; i < guns.Length; i++)
		{
			if(i != selectedWeapon)
				guns[i].SetActive(false);
		}
		guns[selectedWeapon].SetActive(true);
		guns[selectedWeapon].transform.position = gunPosition.transform.position;
	}
}
