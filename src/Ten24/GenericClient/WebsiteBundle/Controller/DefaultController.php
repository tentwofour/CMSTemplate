<?php

namespace Ten24\GenericClient\WebsiteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="ten24_gcwb_default_homepage")
     * @Template()
     */
    public function defaultHomepageAction(Request $request)
    {
        return [];
    }
}
