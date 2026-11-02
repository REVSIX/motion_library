window.MOTION_CATALOG = {
  "schema_version": 1,
  "clips": [
    {
      "id": "claw/00452_crouch",
      "source": "claw",
      "source_name": "CLAW",
      "name": "Crouched walking",
      "category": "Crouch and duck",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/claw/00452_crouch/motion.npz",
          "video": "data/claw/00452_crouch/motion.mp4",
          "fps": 50.0,
          "frames": 281,
          "duration": 5.62,
          "last_sample_time": 5.6,
          "sha256": "1a9095d4771ca4e84209894b5e9ccbd9d4238cecc47c20182f19379e0a3d09b0",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/claw/00452_crouch/provenance.json",
        "motion": "data/claw/00452_crouch/motion.json",
        "validation": "data/claw/00452_crouch/validation.json",
        "source_validation": "data/claw/00452_crouch/source_validation.json"
      },
      "poster": "data/claw/00452_crouch/preview.jpg"
    },
    {
      "id": "claw/00543_hand_crawl",
      "source": "claw",
      "source_name": "CLAW",
      "name": "Hand crawl",
      "category": "Crawl and hand support",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/claw/00543_hand_crawl/motion.npz",
          "video": "data/claw/00543_hand_crawl/motion.mp4",
          "fps": 50.0,
          "frames": 312,
          "duration": 6.24,
          "last_sample_time": 6.22,
          "sha256": "bf31e0be9d820c342ad0d6f3cb0c4cc375500a0a687c5b5701ad21092d1fe84d",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/claw/00543_hand_crawl/provenance.json",
        "motion": "data/claw/00543_hand_crawl/motion.json",
        "validation": "data/claw/00543_hand_crawl/validation.json",
        "source_validation": "data/claw/00543_hand_crawl/source_validation.json"
      },
      "poster": "data/claw/00543_hand_crawl/preview.jpg"
    },
    {
      "id": "claw/02067_elbow_crawl",
      "source": "claw",
      "source_name": "CLAW",
      "name": "Elbow crawl",
      "category": "Crawl and hand support",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/claw/02067_elbow_crawl/motion.npz",
          "video": "data/claw/02067_elbow_crawl/motion.mp4",
          "fps": 50.0,
          "frames": 483,
          "duration": 9.66,
          "last_sample_time": 9.64,
          "sha256": "802acc4a0bbd868de069727a71644228676d8d6e4ee34d89a00f3263b1f526c6",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/claw/02067_elbow_crawl/provenance.json",
        "motion": "data/claw/02067_elbow_crawl/motion.json",
        "validation": "data/claw/02067_elbow_crawl/validation.json",
        "source_validation": "data/claw/02067_elbow_crawl/source_validation.json"
      },
      "poster": "data/claw/02067_elbow_crawl/preview.jpg"
    },
    {
      "id": "hoi_retarget/box_push",
      "source": "hoi_retarget",
      "source_name": "HOI-Retarget",
      "name": "Two-hand box push",
      "category": "Object pushing",
      "description": "G1 reference with a moving object mesh and floor. Source hand-contact labels are retained; ball-hand contact and dynamic tracking require validation.",
      "experimental": false,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/leggedrobotics/hoi-retarget",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/hoi_retarget/box_push/motion.npz",
          "video": "data/hoi_retarget/box_push/motion.mp4",
          "fps": 50.0,
          "frames": 327,
          "duration": 6.54,
          "last_sample_time": 6.52,
          "sha256": "d48d51bb0f07887862499ab377966828d1dff5e1ac8f2f941985723c1f2fb127",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes",
          "object": "largebox"
        }
      ],
      "reports": {
        "quality_review": "data/hoi_retarget/box_push/quality_review.json",
        "provenance": "data/hoi_retarget/box_push/provenance.json",
        "render": "data/hoi_retarget/box_push/render.json"
      },
      "poster": "data/hoi_retarget/box_push/preview.jpg"
    },
    {
      "id": "hoi_retarget/plastic_box_push",
      "source": "hoi_retarget",
      "source_name": "HOI-Retarget",
      "name": "Low box push",
      "category": "Object pushing",
      "description": "G1 reference with a moving object mesh and floor. Source hand-contact labels are retained; ball-hand contact and dynamic tracking require validation.",
      "experimental": false,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/leggedrobotics/hoi-retarget",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/hoi_retarget/plastic_box_push/motion.npz",
          "video": "data/hoi_retarget/plastic_box_push/motion.mp4",
          "fps": 50.0,
          "frames": 417,
          "duration": 8.34,
          "last_sample_time": 8.32,
          "sha256": "6bac7e44e2f5fcf65165f56a90c08726fcc73fb06eff73822ab96cf0986b7b82",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes",
          "object": "plasticbox"
        }
      ],
      "reports": {
        "quality_review": "data/hoi_retarget/plastic_box_push/quality_review.json",
        "provenance": "data/hoi_retarget/plastic_box_push/provenance.json",
        "render": "data/hoi_retarget/plastic_box_push/render.json"
      },
      "poster": "data/hoi_retarget/plastic_box_push/preview.jpg"
    },
    {
      "id": "hoi_retarget/suitcase_push",
      "source": "hoi_retarget",
      "source_name": "HOI-Retarget",
      "name": "Two-hand suitcase push",
      "category": "Object pushing",
      "description": "G1 reference with a moving object mesh and floor. Source hand-contact labels are retained; ball-hand contact and dynamic tracking require validation.",
      "experimental": false,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/leggedrobotics/hoi-retarget",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/hoi_retarget/suitcase_push/motion.npz",
          "video": "data/hoi_retarget/suitcase_push/motion.mp4",
          "fps": 50.0,
          "frames": 324,
          "duration": 6.48,
          "last_sample_time": 6.46,
          "sha256": "489150477d6d0ccdf62297d7421e4dc753ceb3ef48b77a6f30372a859bb0b8b7",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes",
          "object": "suitcase"
        }
      ],
      "reports": {
        "quality_review": "data/hoi_retarget/suitcase_push/quality_review.json",
        "provenance": "data/hoi_retarget/suitcase_push/provenance.json",
        "render": "data/hoi_retarget/suitcase_push/render.json"
      },
      "poster": "data/hoi_retarget/suitcase_push/preview.jpg"
    },
    {
      "id": "hoi_retarget/table_push",
      "source": "hoi_retarget",
      "source_name": "HOI-Retarget",
      "name": "Two-hand table push",
      "category": "Object pushing",
      "description": "G1 reference with a moving object mesh and floor. Source hand-contact labels are retained; ball-hand contact and dynamic tracking require validation.",
      "experimental": false,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/leggedrobotics/hoi-retarget",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/hoi_retarget/table_push/motion.npz",
          "video": "data/hoi_retarget/table_push/motion.mp4",
          "fps": 50.0,
          "frames": 281,
          "duration": 5.62,
          "last_sample_time": 5.6,
          "sha256": "8ec4622a27981137fc9da5769bbdf2789e53886421957f5c5bbb95244b216a42",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes",
          "object": "largetable"
        }
      ],
      "reports": {
        "quality_review": "data/hoi_retarget/table_push/quality_review.json",
        "provenance": "data/hoi_retarget/table_push/provenance.json",
        "render": "data/hoi_retarget/table_push/render.json"
      },
      "poster": "data/hoi_retarget/table_push/preview.jpg"
    },
    {
      "id": "humanoidmimicgen/large_cart_push",
      "source": "humanoidmimicgen",
      "source_name": "HumanoidMimicGen",
      "name": "Large wheeled cart push",
      "category": "Object pushing",
      "description": "25.7 s G1 reference pushing a full-height wheeled cart by 2.39 m. Includes the original cart, rotating wheels, moving box and floor. Arm poses are adapted for ball hands; dynamic pushing is unvalidated.",
      "experimental": false,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/linkenv/humanoidmimicgen-g1-source-demo-replay",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/humanoidmimicgen/large_cart_push/motion.npz",
          "video": "data/humanoidmimicgen/large_cart_push/motion.mp4",
          "fps": 50.0,
          "frames": 1286,
          "duration": 25.72,
          "last_sample_time": 25.7,
          "sha256": "7099b5bef71a98545fa13c1be20e98af56106c837cdf28266af6baf60177bd3e",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes",
          "object": "large_shelving_cart"
        }
      ],
      "reports": {
        "quality_review": "data/humanoidmimicgen/large_cart_push/quality_review.json",
        "provenance": "data/humanoidmimicgen/large_cart_push/provenance.json",
        "render": "data/humanoidmimicgen/large_cart_push/render.json",
        "hand_refinement": "data/humanoidmimicgen/large_cart_push/hand_refinement.json"
      },
      "poster": "data/humanoidmimicgen/large_cart_push/preview.jpg"
    },
    {
      "id": "omniretarget/climb_00",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 00",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_00/motion.npz",
          "video": "data/omniretarget/climb_00/motion.mp4",
          "fps": 50.0,
          "frames": 1006,
          "duration": 20.12,
          "last_sample_time": 20.1,
          "sha256": "5775b9d676674d0c5878e951b2ff1a75cf39a89065193f2c70d7c55def34277f",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_00/provenance.json",
        "validation": "data/omniretarget/climb_00/validation.json",
        "build_request": "data/omniretarget/climb_00/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_01",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 01",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_01/motion.npz",
          "video": "data/omniretarget/climb_01/motion.mp4",
          "fps": 50.0,
          "frames": 870,
          "duration": 17.4,
          "last_sample_time": 17.38,
          "sha256": "f5352b137010f893efb061cd0e45fc59b1bc96f76f39e39aff360609c6c3b0c2",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_01/provenance.json",
        "validation": "data/omniretarget/climb_01/validation.json",
        "build_request": "data/omniretarget/climb_01/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_02",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 02",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_02/motion.npz",
          "video": "data/omniretarget/climb_02/motion.mp4",
          "fps": 50.0,
          "frames": 1167,
          "duration": 23.34,
          "last_sample_time": 23.32,
          "sha256": "3a78b8f8c962ab6a9614109c481c9175189e68993f8bb3ebb54e86dbc133893c",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_02/provenance.json",
        "validation": "data/omniretarget/climb_02/validation.json",
        "build_request": "data/omniretarget/climb_02/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_03",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 03",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_03/motion.npz",
          "video": "data/omniretarget/climb_03/motion.mp4",
          "fps": 50.0,
          "frames": 1009,
          "duration": 20.18,
          "last_sample_time": 20.16,
          "sha256": "ce991ebfa4cd48feda0dc1cf34ddec1ccb637228cc1a2de179dad7e12b717cc3",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_03/provenance.json",
        "validation": "data/omniretarget/climb_03/validation.json",
        "build_request": "data/omniretarget/climb_03/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_04",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 04",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_04/motion.npz",
          "video": "data/omniretarget/climb_04/motion.mp4",
          "fps": 50.0,
          "frames": 1254,
          "duration": 25.08,
          "last_sample_time": 25.06,
          "sha256": "e34430b7026bebc90b88a0a53bc317505f9de34c5bd1f7c586317cd75479d289",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_04/provenance.json",
        "validation": "data/omniretarget/climb_04/validation.json",
        "build_request": "data/omniretarget/climb_04/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_05",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 05",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_05/motion.npz",
          "video": "data/omniretarget/climb_05/motion.mp4",
          "fps": 50.0,
          "frames": 1001,
          "duration": 20.02,
          "last_sample_time": 20.0,
          "sha256": "26a72ab494265bd4640e8e159fbc04658c3b1330d4e556f4331fc92b995a719f",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_05/provenance.json",
        "validation": "data/omniretarget/climb_05/validation.json",
        "build_request": "data/omniretarget/climb_05/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_06",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 06",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_06/motion.npz",
          "video": "data/omniretarget/climb_06/motion.mp4",
          "fps": 50.0,
          "frames": 602,
          "duration": 12.04,
          "last_sample_time": 12.02,
          "sha256": "fb4d325bb12311c7d7b5f7e562e964d15e8c1c80750f198d90b39ba90272111d",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_06/provenance.json",
        "validation": "data/omniretarget/climb_06/validation.json",
        "source_validation": "data/omniretarget/climb_06/source_validation.json"
      },
      "poster": "data/omniretarget/climb_06/preview.jpg"
    },
    {
      "id": "omniretarget/climb_07",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 07",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_07/motion.npz",
          "video": "data/omniretarget/climb_07/motion.mp4",
          "fps": 50.0,
          "frames": 491,
          "duration": 9.82,
          "last_sample_time": 9.8,
          "sha256": "8089e8aced4c0d5c052ffa66c441671b3d170dbbc828a84613866bc8d9ba4968",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_07/provenance.json",
        "validation": "data/omniretarget/climb_07/validation.json",
        "build_request": "data/omniretarget/climb_07/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_08",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 08",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_08/motion.npz",
          "video": "data/omniretarget/climb_08/motion.mp4",
          "fps": 50.0,
          "frames": 572,
          "duration": 11.44,
          "last_sample_time": 11.42,
          "sha256": "21af77e88ceaefd8b1a210223af3956ee03d7638f8165ad8e355e684c340abf4",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_08/provenance.json",
        "validation": "data/omniretarget/climb_08/validation.json",
        "source_validation": "data/omniretarget/climb_08/source_validation.json"
      },
      "poster": "data/omniretarget/climb_08/preview.jpg"
    },
    {
      "id": "omniretarget/climb_09",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 09",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_09/motion.npz",
          "video": "data/omniretarget/climb_09/motion.mp4",
          "fps": 50.0,
          "frames": 541,
          "duration": 10.82,
          "last_sample_time": 10.8,
          "sha256": "e114de8dc4816cb48d2c7256422f8a10824d1f30dd22ecba4199cac2401afeb2",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_09/provenance.json",
        "validation": "data/omniretarget/climb_09/validation.json",
        "build_request": "data/omniretarget/climb_09/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_10",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 10",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_10/motion.npz",
          "video": "data/omniretarget/climb_10/motion.mp4",
          "fps": 50.0,
          "frames": 756,
          "duration": 15.12,
          "last_sample_time": 15.1,
          "sha256": "5441bd84afa902e078ef56e30d238b81990861965d3a1d57d8a53feb8ce35c29",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_10/provenance.json",
        "validation": "data/omniretarget/climb_10/validation.json",
        "build_request": "data/omniretarget/climb_10/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_11",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 11",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_11/motion.npz",
          "video": "data/omniretarget/climb_11/motion.mp4",
          "fps": 50.0,
          "frames": 762,
          "duration": 15.24,
          "last_sample_time": 15.22,
          "sha256": "a9589fd2f157e60213c7939d65e4c5bde9f202f20a7143456018f5029c2ef266",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_11/provenance.json",
        "validation": "data/omniretarget/climb_11/validation.json",
        "build_request": "data/omniretarget/climb_11/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_12",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 12",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_12/motion.npz",
          "video": "data/omniretarget/climb_12/motion.mp4",
          "fps": 50.0,
          "frames": 959,
          "duration": 19.18,
          "last_sample_time": 19.16,
          "sha256": "22586f538a347fb1063fea2965d957c886372ceb6080a53c3c69b8e2b5648867",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_12/provenance.json",
        "validation": "data/omniretarget/climb_12/validation.json",
        "build_request": "data/omniretarget/climb_12/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_13",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 13",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_13/motion.npz",
          "video": "data/omniretarget/climb_13/motion.mp4",
          "fps": 50.0,
          "frames": 1097,
          "duration": 21.94,
          "last_sample_time": 21.92,
          "sha256": "7a4257e7710ec7b4b92f8592813e249eb36755f63cfda8bd0a818b46d9fce844",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_13/provenance.json",
        "validation": "data/omniretarget/climb_13/validation.json",
        "build_request": "data/omniretarget/climb_13/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_14",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 14",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_14/motion.npz",
          "video": "data/omniretarget/climb_14/motion.mp4",
          "fps": 50.0,
          "frames": 454,
          "duration": 9.08,
          "last_sample_time": 9.06,
          "sha256": "613dd83775c8e1781a223b0003a6a3e22b23602f42ad089be60f6f6073075d8f",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_14/provenance.json",
        "validation": "data/omniretarget/climb_14/validation.json",
        "source_validation": "data/omniretarget/climb_14/source_validation.json"
      },
      "poster": "data/omniretarget/climb_14/preview.jpg"
    },
    {
      "id": "omniretarget/climb_15",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 15",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_15/motion.npz",
          "video": "data/omniretarget/climb_15/motion.mp4",
          "fps": 50.0,
          "frames": 309,
          "duration": 6.18,
          "last_sample_time": 6.16,
          "sha256": "4db7576c221386eae91e8025735d3cc34145e582cefb44fdcac74b003cdf90e4",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_15/provenance.json",
        "validation": "data/omniretarget/climb_15/validation.json",
        "build_request": "data/omniretarget/climb_15/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_16",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 16",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_16/motion.npz",
          "video": "data/omniretarget/climb_16/motion.mp4",
          "fps": 50.0,
          "frames": 284,
          "duration": 5.68,
          "last_sample_time": 5.66,
          "sha256": "beb2094403215d4ed859f187b9b71b0573b19a8a68f28e8f19670e6200e2a5aa",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_16/provenance.json",
        "validation": "data/omniretarget/climb_16/validation.json",
        "source_validation": "data/omniretarget/climb_16/source_validation.json"
      },
      "poster": "data/omniretarget/climb_16/preview.jpg"
    },
    {
      "id": "omniretarget/climb_17",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 17",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_17/motion.npz",
          "video": "data/omniretarget/climb_17/motion.mp4",
          "fps": 50.0,
          "frames": 252,
          "duration": 5.04,
          "last_sample_time": 5.02,
          "sha256": "fe755d693bf1e9c9362cdb65698f876caf7603b3d4fb44c2c0e2fdeb27ad9f16",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_17/provenance.json",
        "validation": "data/omniretarget/climb_17/validation.json",
        "build_request": "data/omniretarget/climb_17/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_18",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 18",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_18/motion.npz",
          "video": "data/omniretarget/climb_18/motion.mp4",
          "fps": 50.0,
          "frames": 281,
          "duration": 5.62,
          "last_sample_time": 5.6,
          "sha256": "0876416a16c625a467cfa10d688e197aea6d7f9daa6cd0346d8177edbc5b7fe5",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_18/provenance.json",
        "validation": "data/omniretarget/climb_18/validation.json",
        "build_request": "data/omniretarget/climb_18/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_19",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 19",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_19/motion.npz",
          "video": "data/omniretarget/climb_19/motion.mp4",
          "fps": 50.0,
          "frames": 391,
          "duration": 7.82,
          "last_sample_time": 7.8,
          "sha256": "94241e35d3faa297dd658833c1cd7af26adf922eafdedce35f054af01c130898",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_19/provenance.json",
        "validation": "data/omniretarget/climb_19/validation.json",
        "build_request": "data/omniretarget/climb_19/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_20",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 20",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_20/motion.npz",
          "video": "data/omniretarget/climb_20/motion.mp4",
          "fps": 50.0,
          "frames": 604,
          "duration": 12.08,
          "last_sample_time": 12.06,
          "sha256": "50b57ed5333f22a5cd29acf7720c2f515ed3c91100f2c76ae48a244392ad0ae9",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_20/provenance.json",
        "validation": "data/omniretarget/climb_20/validation.json",
        "source_validation": "data/omniretarget/climb_20/source_validation.json"
      },
      "poster": "data/omniretarget/climb_20/preview.jpg"
    },
    {
      "id": "omniretarget/climb_21",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 21",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_21/motion.npz",
          "video": "data/omniretarget/climb_21/motion.mp4",
          "fps": 50.0,
          "frames": 347,
          "duration": 6.94,
          "last_sample_time": 6.92,
          "sha256": "d4f2fba0ed2580333b382c928f441d2d3aac2b8930c145a6b820e7b56abd788e",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_21/provenance.json",
        "validation": "data/omniretarget/climb_21/validation.json",
        "build_request": "data/omniretarget/climb_21/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_22",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 22",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_22/motion.npz",
          "video": "data/omniretarget/climb_22/motion.mp4",
          "fps": 50.0,
          "frames": 566,
          "duration": 11.32,
          "last_sample_time": 11.3,
          "sha256": "155b72c3734357297f9fc9c4d6231fa1cd6165b7314d901e44d5a362cfaafe11",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_22/provenance.json",
        "validation": "data/omniretarget/climb_22/validation.json",
        "build_request": "data/omniretarget/climb_22/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_23",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 23",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_23/motion.npz",
          "video": "data/omniretarget/climb_23/motion.mp4",
          "fps": 50.0,
          "frames": 581,
          "duration": 11.62,
          "last_sample_time": 11.6,
          "sha256": "3d6672494fb701e73184e16cd7755ee51e629223537df63905b41cb895428365",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_23/provenance.json",
        "validation": "data/omniretarget/climb_23/validation.json",
        "build_request": "data/omniretarget/climb_23/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_24",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 24",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_24/motion.npz",
          "video": "data/omniretarget/climb_24/motion.mp4",
          "fps": 50.0,
          "frames": 522,
          "duration": 10.44,
          "last_sample_time": 10.42,
          "sha256": "32c5cdd01ce7d3386d1e97afc2fe863ebb779270bf0f9df6396b3eb8df5a1217",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_24/provenance.json",
        "validation": "data/omniretarget/climb_24/validation.json",
        "build_request": "data/omniretarget/climb_24/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_25",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 25",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_25/motion.npz",
          "video": "data/omniretarget/climb_25/motion.mp4",
          "fps": 50.0,
          "frames": 561,
          "duration": 11.22,
          "last_sample_time": 11.2,
          "sha256": "de11328ec2c99ff83d726a975c4ebc633c76208151f079cd2e29dd4c6f7e0cf1",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_25/provenance.json",
        "validation": "data/omniretarget/climb_25/validation.json",
        "build_request": "data/omniretarget/climb_25/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_26",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 26",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_26/motion.npz",
          "video": "data/omniretarget/climb_26/motion.mp4",
          "fps": 50.0,
          "frames": 316,
          "duration": 6.32,
          "last_sample_time": 6.3,
          "sha256": "d1872cc4f296fccc28593e2c8934ff4208660d5331bb0ce13fbf31f414f8a905",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_26/provenance.json",
        "validation": "data/omniretarget/climb_26/validation.json",
        "source_validation": "data/omniretarget/climb_26/source_validation.json"
      },
      "poster": "data/omniretarget/climb_26/preview.jpg"
    },
    {
      "id": "omniretarget/climb_27",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 27",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_27/motion.npz",
          "video": "data/omniretarget/climb_27/motion.mp4",
          "fps": 50.0,
          "frames": 296,
          "duration": 5.92,
          "last_sample_time": 5.9,
          "sha256": "8f274bafe547b9d34aa8487128c1a87c4c0f006cf75d2cd981494cf22b95c4c6",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_27/provenance.json",
        "validation": "data/omniretarget/climb_27/validation.json",
        "build_request": "data/omniretarget/climb_27/build_request.json"
      },
      "poster": null
    },
    {
      "id": "omniretarget/climb_28",
      "source": "omniretarget",
      "source_name": "OmniRetarget",
      "name": "Climb 28",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/omniretarget/climb_28/motion.npz",
          "video": "data/omniretarget/climb_28/motion.mp4",
          "fps": 50.0,
          "frames": 367,
          "duration": 7.34,
          "last_sample_time": 7.32,
          "sha256": "1cabfaf83942bdeccdaaea7d89c5c3c9995309ed003c7c3838700b733d5fb433",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/omniretarget/climb_28/provenance.json",
        "validation": "data/omniretarget/climb_28/validation.json",
        "source_validation": "data/omniretarget/climb_28/source_validation.json"
      },
      "poster": "data/omniretarget/climb_28/preview.jpg"
    },
    {
      "id": "parc/jump_001",
      "source": "parc",
      "source_name": "PARC",
      "name": "Running jump 01",
      "category": "Jump and landing",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/parc/jump_001/motion.npz",
          "video": "data/parc/jump_001/motion.mp4",
          "fps": 50.0,
          "frames": 182,
          "duration": 3.64,
          "last_sample_time": 3.62,
          "sha256": "0afb6698c29c0216ca36d371d9ba8f3adf3c3c36fe32e419005365ce587ce662",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/parc/jump_001/provenance.json",
        "gap_measurements": "data/parc/jump_001/gap_measurements.json",
        "validation": "data/parc/jump_001/validation.json",
        "arm_validation": "data/parc/jump_001/arm_validation.json",
        "source_validation": "data/parc/jump_001/source_validation.json"
      },
      "poster": "data/parc/jump_001/preview.jpg"
    },
    {
      "id": "parc/jump_002",
      "source": "parc",
      "source_name": "PARC",
      "name": "Running jumps 02",
      "category": "Jump and landing",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/parc/jump_002/motion.npz",
          "video": "data/parc/jump_002/motion.mp4",
          "fps": 50.0,
          "frames": 517,
          "duration": 10.34,
          "last_sample_time": 10.32,
          "sha256": "cdde3e81d1c151b6d20d54896841b95967157218c524b97cca707774ae8045af",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/parc/jump_002/provenance.json",
        "gap_measurements": "data/parc/jump_002/gap_measurements.json",
        "validation": "data/parc/jump_002/validation.json",
        "arm_validation": "data/parc/jump_002/arm_validation.json",
        "source_validation": "data/parc/jump_002/source_validation.json"
      },
      "poster": "data/parc/jump_002/preview.jpg"
    },
    {
      "id": "parc/jump_003",
      "source": "parc",
      "source_name": "PARC",
      "name": "Running jumps 03",
      "category": "Jump and landing",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/parc/jump_003/motion.npz",
          "video": "data/parc/jump_003/motion.mp4",
          "fps": 50.0,
          "frames": 224,
          "duration": 4.48,
          "last_sample_time": 4.46,
          "sha256": "fb7ad2c731c9f5659dfc020ccd158ec04be40d7ff1b49bebc97933a139d9c548",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/parc/jump_003/provenance.json",
        "gap_measurements": "data/parc/jump_003/gap_measurements.json",
        "validation": "data/parc/jump_003/validation.json",
        "arm_validation": "data/parc/jump_003/arm_validation.json",
        "source_validation": "data/parc/jump_003/source_validation.json"
      },
      "poster": "data/parc/jump_003/preview.jpg"
    },
    {
      "id": "parc/jump_004",
      "source": "parc",
      "source_name": "PARC",
      "name": "Turning jumps 04",
      "category": "Jump and landing",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/parc/jump_004/motion.npz",
          "video": "data/parc/jump_004/motion.mp4",
          "fps": 50.0,
          "frames": 241,
          "duration": 4.82,
          "last_sample_time": 4.8,
          "sha256": "d9d7e92bf5a1d8c95ad43007334b471b1a69a32d5068d89f95a79e36efa010c4",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/parc/jump_004/provenance.json",
        "gap_measurements": "data/parc/jump_004/gap_measurements.json",
        "validation": "data/parc/jump_004/validation.json",
        "arm_validation": "data/parc/jump_004/arm_validation.json",
        "source_validation": "data/parc/jump_004/source_validation.json"
      },
      "poster": "data/parc/jump_004/preview.jpg"
    },
    {
      "id": "parc/jump_005",
      "source": "parc",
      "source_name": "PARC",
      "name": "Running jumps 05",
      "category": "Jump and landing",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/parc/jump_005/motion.npz",
          "video": "data/parc/jump_005/motion.mp4",
          "fps": 50.0,
          "frames": 326,
          "duration": 6.52,
          "last_sample_time": 6.5,
          "sha256": "9dcef3e1e695c7402be016c805904eaf139cd9ce58950214005ae8214736ffac",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/parc/jump_005/provenance.json",
        "gap_measurements": "data/parc/jump_005/gap_measurements.json",
        "validation": "data/parc/jump_005/validation.json",
        "arm_validation": "data/parc/jump_005/arm_validation.json",
        "source_validation": "data/parc/jump_005/source_validation.json"
      },
      "poster": "data/parc/jump_005/preview.jpg"
    },
    {
      "id": "deep_wholebody_parkour/dive_roll",
      "source": "deep_wholebody_parkour",
      "source_name": "Deep Whole-body Parkour",
      "name": "Dive roll",
      "category": "Recovery and roll",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/deep_wholebody_parkour/dive_roll/motion.npz",
          "video": "data/deep_wholebody_parkour/dive_roll/motion.mp4",
          "fps": 50.0,
          "frames": 417,
          "duration": 8.34,
          "last_sample_time": 8.32,
          "sha256": "36cc3de8387915df79a8612fbb80ef73d17609de88d40b01581eb1cd88fd579a",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "mesh"
        }
      ],
      "reports": {
        "provenance": "data/deep_wholebody_parkour/dive_roll/provenance.json",
        "validation": "data/deep_wholebody_parkour/dive_roll/validation.json",
        "source_validation": "data/deep_wholebody_parkour/dive_roll/source_validation.json"
      },
      "poster": "data/deep_wholebody_parkour/dive_roll/preview.jpg"
    },
    {
      "id": "deep_wholebody_parkour/jump_sit",
      "source": "deep_wholebody_parkour",
      "source_name": "Deep Whole-body Parkour",
      "name": "Jump sit",
      "category": "Sit and stand",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/deep_wholebody_parkour/jump_sit/motion.npz",
          "video": "data/deep_wholebody_parkour/jump_sit/motion.mp4",
          "fps": 50.0,
          "frames": 537,
          "duration": 10.74,
          "last_sample_time": 10.72,
          "sha256": "18c179d3c9697f72bd4d7b01bcdf145c8ce8ca7588765af117a72636ff71d0f7",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "mesh"
        }
      ],
      "reports": {
        "provenance": "data/deep_wholebody_parkour/jump_sit/provenance.json",
        "validation": "data/deep_wholebody_parkour/jump_sit/validation.json",
        "source_validation": "data/deep_wholebody_parkour/jump_sit/source_validation.json"
      },
      "poster": "data/deep_wholebody_parkour/jump_sit/preview.jpg"
    },
    {
      "id": "deep_wholebody_parkour/kneel_climb",
      "source": "deep_wholebody_parkour",
      "source_name": "Deep Whole-body Parkour",
      "name": "Kneel climb",
      "category": "Climb and slope",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/deep_wholebody_parkour/kneel_climb/motion.npz",
          "video": "data/deep_wholebody_parkour/kneel_climb/motion.mp4",
          "fps": 50.0,
          "frames": 554,
          "duration": 11.08,
          "last_sample_time": 11.06,
          "sha256": "9aefd4d54f7c7f8326225b11f53883dae9aa573a76c4f062012793465d0c54a2",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "mesh"
        }
      ],
      "reports": {
        "provenance": "data/deep_wholebody_parkour/kneel_climb/provenance.json",
        "validation": "data/deep_wholebody_parkour/kneel_climb/validation.json",
        "source_validation": "data/deep_wholebody_parkour/kneel_climb/source_validation.json"
      },
      "poster": "data/deep_wholebody_parkour/kneel_climb/preview.jpg"
    },
    {
      "id": "deep_wholebody_parkour/roll_vault",
      "source": "deep_wholebody_parkour",
      "source_name": "Deep Whole-body Parkour",
      "name": "Roll vault",
      "category": "Vault",
      "description": "",
      "experimental": false,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/deep_wholebody_parkour/roll_vault/motion.npz",
          "video": "data/deep_wholebody_parkour/roll_vault/motion.mp4",
          "fps": 50.0,
          "frames": 523,
          "duration": 10.46,
          "last_sample_time": 10.44,
          "sha256": "505a355e7e34c6023e960b495c9f0c43fa10d13df127655b0e41784872a547ee",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "mesh"
        }
      ],
      "reports": {
        "provenance": "data/deep_wholebody_parkour/roll_vault/provenance.json",
        "validation": "data/deep_wholebody_parkour/roll_vault/validation.json",
        "source_validation": "data/deep_wholebody_parkour/roll_vault/source_validation.json"
      },
      "poster": "data/deep_wholebody_parkour/roll_vault/preview.jpg"
    },
    {
      "id": "kimodo/long_jump_v1/jump_gap/seed_48",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Long jump v1 / jump gap / seed 48",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/long_jump_v1/jump_gap/seed_48/motion.npz",
          "video": "data/kimodo/long_jump_v1/jump_gap/seed_48/motion.mp4",
          "fps": 50.0,
          "frames": 249,
          "duration": 4.98,
          "last_sample_time": 4.96,
          "sha256": "39d034075261088e193b26cad5e2ddc2602e70184bd09112613c02947d1700d7",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/long_jump_v1/jump_gap/seed_48/refinement.json",
        "provenance": "data/kimodo/long_jump_v1/jump_gap/seed_48/provenance.json",
        "validation": "data/kimodo/long_jump_v1/jump_gap/seed_48/validation.json",
        "constraints": "data/kimodo/long_jump_v1/jump_gap/seed_48/constraints.json",
        "terrain": "data/kimodo/long_jump_v1/jump_gap/seed_48/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/long_jump_v1/jump_gap/seed_49",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Long jump v1 / jump gap / seed 49",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/long_jump_v1/jump_gap/seed_49/motion.npz",
          "video": "data/kimodo/long_jump_v1/jump_gap/seed_49/motion.mp4",
          "fps": 50.0,
          "frames": 249,
          "duration": 4.98,
          "last_sample_time": 4.96,
          "sha256": "11eb1e3a8ce62357f637fc7a8be6cc7e78cdec32eb64ec9b2bcfc4bf21c0f682",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/long_jump_v1/jump_gap/seed_49/refinement.json",
        "provenance": "data/kimodo/long_jump_v1/jump_gap/seed_49/provenance.json",
        "validation": "data/kimodo/long_jump_v1/jump_gap/seed_49/validation.json",
        "constraints": "data/kimodo/long_jump_v1/jump_gap/seed_49/constraints.json",
        "terrain": "data/kimodo/long_jump_v1/jump_gap/seed_49/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/long_jump_v1/jump_gap/seed_50",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Long jump v1 / jump gap / seed 50",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/long_jump_v1/jump_gap/seed_50/motion.npz",
          "video": "data/kimodo/long_jump_v1/jump_gap/seed_50/motion.mp4",
          "fps": 50.0,
          "frames": 249,
          "duration": 4.98,
          "last_sample_time": 4.96,
          "sha256": "e0b94f82cb30fa2088849ef25382ad7260e80c5dcc15c84a8c7a0f980186686b",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/long_jump_v1/jump_gap/seed_50/refinement.json",
        "provenance": "data/kimodo/long_jump_v1/jump_gap/seed_50/provenance.json",
        "validation": "data/kimodo/long_jump_v1/jump_gap/seed_50/validation.json",
        "constraints": "data/kimodo/long_jump_v1/jump_gap/seed_50/constraints.json",
        "terrain": "data/kimodo/long_jump_v1/jump_gap/seed_50/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/long_jump_v1/jump_gap/seed_51",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Long jump v1 / jump gap / seed 51",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/long_jump_v1/jump_gap/seed_51/motion.npz",
          "video": "data/kimodo/long_jump_v1/jump_gap/seed_51/motion.mp4",
          "fps": 50.0,
          "frames": 249,
          "duration": 4.98,
          "last_sample_time": 4.96,
          "sha256": "61593acfce4b5f4f89134eaa7cc1fc4f6b6a53207312ba00530b6a7eb2407a7c",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/long_jump_v1/jump_gap/seed_51/refinement.json",
        "provenance": "data/kimodo/long_jump_v1/jump_gap/seed_51/provenance.json",
        "validation": "data/kimodo/long_jump_v1/jump_gap/seed_51/validation.json",
        "constraints": "data/kimodo/long_jump_v1/jump_gap/seed_51/constraints.json",
        "terrain": "data/kimodo/long_jump_v1/jump_gap/seed_51/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/supplied_stairs",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Supplied stairs",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/supplied_stairs/motion.npz",
          "video": "data/kimodo/supplied_stairs/motion.mp4",
          "fps": 50.0,
          "frames": 174,
          "duration": 3.48,
          "last_sample_time": 3.46,
          "sha256": "c653f9d651e5fc1fafda1b8b0b13c8b2b7bcd9e0cf7c144162b0d756db909b19",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "provenance": "data/kimodo/supplied_stairs/provenance.json",
        "motion": "data/kimodo/supplied_stairs/motion.json",
        "validation": "data/kimodo/supplied_stairs/validation.json"
      },
      "poster": "data/kimodo/supplied_stairs/preview.jpg"
    },
    {
      "id": "kimodo/terrain_batch_v1/crawl/seed_44",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crawl / seed 44",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crawl/seed_44/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crawl/seed_44/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "d9cc938122a0ab99f5c1387caaff23805ce335f949f4cf78758f2e18ed7c284e",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crawl/seed_44/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crawl/seed_44/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crawl/seed_44/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crawl/seed_44/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crawl/seed_44/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crawl/seed_45",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crawl / seed 45",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crawl/seed_45/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crawl/seed_45/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "fc7a87cb507568c742d29ff8ff7e880ad50b8df6818605aecc179e15c9140f2e",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crawl/seed_45/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crawl/seed_45/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crawl/seed_45/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crawl/seed_45/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crawl/seed_45/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crawl/seed_46",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crawl / seed 46",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crawl/seed_46/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crawl/seed_46/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "303c4b60e558d3af4a67e173c3907f87b8d01bfe214670fc0989d340d290a006",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crawl/seed_46/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crawl/seed_46/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crawl/seed_46/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crawl/seed_46/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crawl/seed_46/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crawl/seed_47",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crawl / seed 47",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crawl/seed_47/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crawl/seed_47/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "f352edb3a32f2de8a916cf5dbe78503ad0e88abb74df0c64d6b34efa9af33ee4",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crawl/seed_47/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crawl/seed_47/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crawl/seed_47/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crawl/seed_47/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crawl/seed_47/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crouch/seed_44",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crouch / seed 44",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crouch/seed_44/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crouch/seed_44/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "1cba3aa632c4be0cc35d5158d200d9d98914dc3da29bd9cc88be7e5c4bbdb920",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crouch/seed_44/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crouch/seed_44/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crouch/seed_44/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crouch/seed_44/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crouch/seed_44/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crouch/seed_45",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crouch / seed 45",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crouch/seed_45/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crouch/seed_45/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "0612e3ed142c4e84438cba339b89cbb01a92262cf0dd7080eed488ec5e4e1603",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crouch/seed_45/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crouch/seed_45/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crouch/seed_45/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crouch/seed_45/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crouch/seed_45/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crouch/seed_46",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crouch / seed 46",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crouch/seed_46/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crouch/seed_46/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "5e8e4fdd6d2087e2efbc3175dded76127d44963b28ed924a529ac6aa4929bd5c",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crouch/seed_46/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crouch/seed_46/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crouch/seed_46/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crouch/seed_46/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crouch/seed_46/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/crouch/seed_47",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / crouch / seed 47",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/crouch/seed_47/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/crouch/seed_47/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "94312e837486f80984946e19011319432a73d290e9eeb2d9e088145fda79dfb4",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/crouch/seed_47/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/crouch/seed_47/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/crouch/seed_47/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/crouch/seed_47/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/crouch/seed_47/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/jump_gap/seed_44",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / jump gap / seed 44",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "65d14209f79e9a19cdebb3ce12610a5e3585b3a82956bc3bfe14dfeb464400bf",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/jump_gap/seed_44/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/jump_gap/seed_45",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / jump gap / seed 45",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "7421cd49855e09ae440f6e67eb05ded383f14a2e3bf48fdfb901b95cea3ce305",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/jump_gap/seed_45/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/jump_gap/seed_46",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / jump gap / seed 46",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "debf103fc2f8627352c7e03dabc8ce604cae7c7aeefd1937dc380c2b459cc1f7",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/jump_gap/seed_46/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/jump_gap/seed_47",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / jump gap / seed 47",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "4e155607ac472c5bb762aa35a7d3d0793f593e6f3c29ff4e07ef0e59a586f33c",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/jump_gap/seed_47/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/ramp/seed_45",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / ramp / seed 45",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/ramp/seed_45/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/ramp/seed_45/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "9ebee26a20435b6169e891b9fd7129d1a366aa46f68ff67b2f4c31c711eaa799",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/ramp/seed_45/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/ramp/seed_45/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/ramp/seed_45/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/ramp/seed_45/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/ramp/seed_45/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/ramp/seed_46",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / ramp / seed 46",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/ramp/seed_46/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/ramp/seed_46/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "704d184c271d83781797dc3ad94607c9c8130be5f73fd9ecbf24589e4f20a68f",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/ramp/seed_46/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/ramp/seed_46/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/ramp/seed_46/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/ramp/seed_46/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/ramp/seed_46/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_batch_v1/ramp/seed_47",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain batch v1 / ramp / seed 47",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_batch_v1/ramp/seed_47/motion.npz",
          "video": "data/kimodo/terrain_batch_v1/ramp/seed_47/motion.mp4",
          "fps": 50.0,
          "frames": 299,
          "duration": 5.98,
          "last_sample_time": 5.96,
          "sha256": "6eb6dbda105f106d37e2394affa3eadbf77ba3b80cf8c8e918c8e45089f8c61b",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_batch_v1/ramp/seed_47/refinement.json",
        "provenance": "data/kimodo/terrain_batch_v1/ramp/seed_47/provenance.json",
        "validation": "data/kimodo/terrain_batch_v1/ramp/seed_47/validation.json",
        "constraints": "data/kimodo/terrain_batch_v1/ramp/seed_47/constraints.json",
        "terrain": "data/kimodo/terrain_batch_v1/ramp/seed_47/terrain.json"
      },
      "poster": null
    },
    {
      "id": "kimodo/terrain_first_platform_seed44",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain first platform seed44",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_first_platform_seed44/motion.npz",
          "video": "data/kimodo/terrain_first_platform_seed44/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "36e527edaa60d4c527c68d12c685c3b1fc4d687f0ad5a46338fb7085990e38c1",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_first_platform_seed44/refinement.json",
        "provenance": "data/kimodo/terrain_first_platform_seed44/provenance.json",
        "validation": "data/kimodo/terrain_first_platform_seed44/validation.json",
        "constraints": "data/kimodo/terrain_first_platform_seed44/constraints.json",
        "terrain": "data/kimodo/terrain_first_platform_seed44/terrain.json"
      },
      "poster": "data/kimodo/terrain_first_platform_seed44/preview.jpg"
    },
    {
      "id": "kimodo/terrain_first_platform_seed45",
      "source": "kimodo",
      "source_name": "Kimodo",
      "name": "Terrain first platform seed45",
      "category": "",
      "description": "",
      "experimental": true,
      "local_only": false,
      "source_url": null,
      "variants": [
        {
          "name": "Reference",
          "npz": "data/kimodo/terrain_first_platform_seed45/motion.npz",
          "video": "data/kimodo/terrain_first_platform_seed45/motion.mp4",
          "fps": 50.0,
          "frames": 199,
          "duration": 3.98,
          "last_sample_time": 3.96,
          "sha256": "7cd19bf2cb8cbe4a6d367cd118cdd500c1ce87bc72a08486593dc389c5bfada2",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "refinement": "data/kimodo/terrain_first_platform_seed45/refinement.json",
        "pipeline_status": "data/kimodo/terrain_first_platform_seed45/pipeline_status.json",
        "provenance": "data/kimodo/terrain_first_platform_seed45/provenance.json",
        "validation": "data/kimodo/terrain_first_platform_seed45/validation.json",
        "constraints": "data/kimodo/terrain_first_platform_seed45/constraints.json",
        "terrain": "data/kimodo/terrain_first_platform_seed45/terrain.json"
      },
      "poster": "data/kimodo/terrain_first_platform_seed45/preview.jpg"
    },
    {
      "id": "mixamo/climbing_3",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Ladder Climb Two Steps At A Time",
      "category": "Ladder",
      "description": "Ladder climbing with fitted box terrain. Existing fit has uneven rungs; hand/foot support and dynamic tracking remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Climbing_3.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/climbing_3/motion.npz",
          "video": "data/mixamo/climbing_3/motion.mp4",
          "fps": 50.0,
          "frames": 149,
          "duration": 2.98,
          "last_sample_time": 2.96,
          "sha256": "7c2a268da0e9248dfaab1d24431edc67f2a528e90dabe643dcfc720e20ee9a5a",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/climbing_3/quality_review.json",
        "provenance": "data/mixamo/climbing_3/provenance.json",
        "validation": "data/mixamo/climbing_3/validation.json",
        "terrain_fit": "data/mixamo/climbing_3/terrain_fit.json",
        "terrain_validation": "data/mixamo/climbing_3/terrain_validation.json",
        "build_request": "data/mixamo/climbing_3/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/climbing_5",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Starting To Climb Onto A Box Or Short Fence",
      "category": "Climb and slope",
      "description": "Climb and slope. Static climb terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Climbing_5.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/climbing_5/motion.npz",
          "video": "data/mixamo/climbing_5/motion.mp4",
          "fps": 50.0,
          "frames": 114,
          "duration": 2.28,
          "last_sample_time": 2.26,
          "sha256": "efd268f8adbf53866e58c2fe3ba7751602bddb7f07d8aa918f8b1ad3767f6eae",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/climbing_5/quality_review.json",
        "provenance": "data/mixamo/climbing_5/provenance.json",
        "validation": "data/mixamo/climbing_5/validation.json",
        "terrain_fit": "data/mixamo/climbing_5/terrain_fit.json",
        "terrain_validation": "data/mixamo/climbing_5/terrain_validation.json",
        "build_request": "data/mixamo/climbing_5/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/climbing_6",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Ladder Climb One Step At A Time",
      "category": "Ladder",
      "description": "Ladder climbing with fitted box terrain. Existing fit has uneven rungs; hand/foot support and dynamic tracking remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Climbing_6.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/climbing_6/motion.npz",
          "video": "data/mixamo/climbing_6/motion.mp4",
          "fps": 50.0,
          "frames": 79,
          "duration": 1.58,
          "last_sample_time": 1.56,
          "sha256": "100e99be0d08c3e8c1433a0ccb853873f4ca4a71d6c9b7603144cc09b08282de",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/climbing_6/quality_review.json",
        "provenance": "data/mixamo/climbing_6/provenance.json",
        "validation": "data/mixamo/climbing_6/validation.json",
        "terrain_fit": "data/mixamo/climbing_6/terrain_fit.json",
        "terrain_validation": "data/mixamo/climbing_6/terrain_validation.json",
        "build_request": "data/mixamo/climbing_6/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/climbing_ladder",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Climbing Up A Ladder",
      "category": "Ladder",
      "description": "Ladder climbing with fitted box terrain. Existing fit has uneven rungs; hand/foot support and dynamic tracking remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Climbing_Ladder.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/climbing_ladder/motion.npz",
          "video": "data/mixamo/climbing_ladder/motion.mp4",
          "fps": 50.0,
          "frames": 39,
          "duration": 0.78,
          "last_sample_time": 0.76,
          "sha256": "ada4799474e8f97b8141400fbf5799db84e479b2f578d4dce8c3317aed99d15a",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/climbing_ladder/quality_review.json",
        "provenance": "data/mixamo/climbing_ladder/provenance.json",
        "validation": "data/mixamo/climbing_ladder/validation.json",
        "terrain_fit": "data/mixamo/climbing_ladder/terrain_fit.json",
        "terrain_validation": "data/mixamo/climbing_ladder/terrain_validation.json",
        "build_request": "data/mixamo/climbing_ladder/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/climbing_to_top",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Climbing Up A Ladder To Standing",
      "category": "Ladder",
      "description": "Ladder climbing with fitted box terrain. Existing fit has uneven rungs; hand/foot support and dynamic tracking remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Climbing_To_Top.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/climbing_to_top/motion.npz",
          "video": "data/mixamo/climbing_to_top/motion.mp4",
          "fps": 50.0,
          "frames": 201,
          "duration": 4.02,
          "last_sample_time": 4.0,
          "sha256": "16e1324594b81db742db4692ce8c362e4f335339d06287503ca6eda5ecd21d75",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/climbing_to_top/quality_review.json",
        "provenance": "data/mixamo/climbing_to_top/provenance.json",
        "validation": "data/mixamo/climbing_to_top/validation.json",
        "terrain_fit": "data/mixamo/climbing_to_top/terrain_fit.json",
        "terrain_validation": "data/mixamo/climbing_to_top/terrain_validation.json",
        "build_request": "data/mixamo/climbing_to_top/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/crouch_turn_right_90",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Turning 90 Degrees Right",
      "category": "Crouch and duck",
      "description": "Crouch and duck. Static passage terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Crouch_Turn_Right_90.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/crouch_turn_right_90/motion.npz",
          "video": "data/mixamo/crouch_turn_right_90/motion.mp4",
          "fps": 50.0,
          "frames": 82,
          "duration": 1.64,
          "last_sample_time": 1.62,
          "sha256": "87b36e902d80ddd9b8ae94799a9954633fa1fa5ff98176bf55e812ba6bbe1a7a",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/crouch_turn_right_90/quality_review.json",
        "provenance": "data/mixamo/crouch_turn_right_90/provenance.json",
        "validation": "data/mixamo/crouch_turn_right_90/validation.json",
        "terrain_fit": "data/mixamo/crouch_turn_right_90/terrain_fit.json",
        "terrain_validation": "data/mixamo/crouch_turn_right_90/terrain_validation.json",
        "build_request": "data/mixamo/crouch_turn_right_90/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/crouch_walk_right_2",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Walking Right While Crouched",
      "category": "Crouch and duck",
      "description": "Crouch and duck. Static passage terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Crouch_Walk_Right_2.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/crouch_walk_right_2/motion.npz",
          "video": "data/mixamo/crouch_walk_right_2/motion.mp4",
          "fps": 50.0,
          "frames": 64,
          "duration": 1.28,
          "last_sample_time": 1.26,
          "sha256": "95fa630b47cf146051120381e28525ddf8b2548b6479773f5c25f9ea24ff4ac3",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/crouch_walk_right_2/quality_review.json",
        "provenance": "data/mixamo/crouch_walk_right_2/provenance.json",
        "validation": "data/mixamo/crouch_walk_right_2/validation.json",
        "terrain_fit": "data/mixamo/crouch_walk_right_2/terrain_fit.json",
        "terrain_validation": "data/mixamo/crouch_walk_right_2/terrain_validation.json",
        "build_request": "data/mixamo/crouch_walk_right_2/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/ducking_2",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Ducking For Cover From Standing Idle",
      "category": "Crouch and duck",
      "description": "Crouch and duck. Static passage terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Ducking_2.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/ducking_2/motion.npz",
          "video": "data/mixamo/ducking_2/motion.mp4",
          "fps": 50.0,
          "frames": 77,
          "duration": 1.54,
          "last_sample_time": 1.52,
          "sha256": "9b03ffd793013105bc2f79bd07085d296d2ffd7b030ccbfe80ad4b9b5e9db04e",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/ducking_2/quality_review.json",
        "provenance": "data/mixamo/ducking_2/provenance.json",
        "validation": "data/mixamo/ducking_2/validation.json",
        "terrain_fit": "data/mixamo/ducking_2/terrain_fit.json",
        "terrain_validation": "data/mixamo/ducking_2/terrain_validation.json",
        "build_request": "data/mixamo/ducking_2/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/jump_2",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Forward Running Jump",
      "category": "Jump and landing",
      "description": "Jump and landing. Static gap terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Jump_2.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/jump_2/motion.npz",
          "video": "data/mixamo/jump_2/motion.mp4",
          "fps": 50.0,
          "frames": 44,
          "duration": 0.88,
          "last_sample_time": 0.86,
          "sha256": "5fc567acff27620e3ed50415e3dbcdb78f96cc594147593d58815bba0bc7f06b",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/jump_2/quality_review.json",
        "provenance": "data/mixamo/jump_2/provenance.json",
        "validation": "data/mixamo/jump_2/validation.json",
        "terrain_fit": "data/mixamo/jump_2/terrain_fit.json",
        "terrain_validation": "data/mixamo/jump_2/terrain_validation.json",
        "build_request": "data/mixamo/jump_2/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/jump_3",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Forward Running Jump",
      "category": "Jump and landing",
      "description": "Jump and landing. Static gap terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Jump_3.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/jump_3/motion.npz",
          "video": "data/mixamo/jump_3/motion.mp4",
          "fps": 50.0,
          "frames": 51,
          "duration": 1.02,
          "last_sample_time": 1.0,
          "sha256": "e3c95f5185f4d3b81b5d5926392ac33390123e3bf1fbd46090ef0fe8f68ea5ac",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/jump_3/quality_review.json",
        "provenance": "data/mixamo/jump_3/provenance.json",
        "validation": "data/mixamo/jump_3/validation.json",
        "terrain_fit": "data/mixamo/jump_3/terrain_fit.json",
        "terrain_validation": "data/mixamo/jump_3/terrain_validation.json",
        "build_request": "data/mixamo/jump_3/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/running_jump",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Jumping From A Sprint",
      "category": "Jump and landing",
      "description": "Jump and landing. Static gap terrain fitted to this G1 reference and stored in the NPZ. Motion samples and timing preserved. Kinematic replay; dynamic tracking and support contacts remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Running_Jump.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/running_jump/motion.npz",
          "video": "data/mixamo/running_jump/motion.mp4",
          "fps": 50.0,
          "frames": 46,
          "duration": 0.92,
          "last_sample_time": 0.9,
          "sha256": "fa49517a86d8789e2823acbb05ba44e2a985d49b67244f2a50649f06366b7a81",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/running_jump/quality_review.json",
        "provenance": "data/mixamo/running_jump/provenance.json",
        "validation": "data/mixamo/running_jump/validation.json",
        "terrain_fit": "data/mixamo/running_jump/terrain_fit.json",
        "terrain_validation": "data/mixamo/running_jump/terrain_validation.json",
        "build_request": "data/mixamo/running_jump/build_request.json"
      },
      "poster": null
    },
    {
      "id": "mixamo/start_climbing_ladder",
      "source": "mixamo",
      "source_name": "Mixamo",
      "name": "Standing To Climb Ladder Quickly",
      "category": "Ladder",
      "description": "Ladder climbing with fitted box terrain. Existing fit has uneven rungs; hand/foot support and dynamic tracking remain unvalidated.",
      "experimental": true,
      "local_only": false,
      "source_url": "https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters/blob/7f134bc734557b1d9516cb476d25ea1f577e45c1/animation/Start_Climbing_Ladder.fbx",
      "variants": [
        {
          "name": "Reference",
          "npz": "data/mixamo/start_climbing_ladder/motion.npz",
          "video": "data/mixamo/start_climbing_ladder/motion.mp4",
          "fps": 50.0,
          "frames": 102,
          "duration": 2.04,
          "last_sample_time": 2.02,
          "sha256": "a97b7c22c874e59c3dc25005ee24f98fb551218d40f392d8c8675aba431029b8",
          "asset": "UNITREE_G1_29DOF_BALL_HAND_CFG",
          "terrain": "boxes"
        }
      ],
      "reports": {
        "quality_review": "data/mixamo/start_climbing_ladder/quality_review.json",
        "provenance": "data/mixamo/start_climbing_ladder/provenance.json",
        "validation": "data/mixamo/start_climbing_ladder/validation.json",
        "terrain_fit": "data/mixamo/start_climbing_ladder/terrain_fit.json",
        "terrain_validation": "data/mixamo/start_climbing_ladder/terrain_validation.json",
        "build_request": "data/mixamo/start_climbing_ladder/build_request.json"
      },
      "poster": null
    }
  ]
};
