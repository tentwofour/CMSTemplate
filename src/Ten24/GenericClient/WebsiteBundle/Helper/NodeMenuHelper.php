<?php

namespace Ten24\GenericClient\WebsiteBundle\Helper;

use Kunstmaan\NodeBundle\Helper\NodeMenu;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Kunstmaan\AdminBundle\Helper\Security\Acl\Permission\PermissionMap;

class NodeMenuHelper
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var SecurityContext
     */
    private $securityContext;

    /**
     * @var ACLHelper
     */
    private $aclHelper;

    /**
     * @param $em
     * @param $securityContext
     * @param $aclHelper
     */
    public function __construct($em, $securityContext, $aclHelper)
    {
        $this->em = $em;
        $this->securityContext = $securityContext;
        $this->aclHelper = $aclHelper;
    }

    /**
     * Get the NodeMenu
     * @param $url
     * @param $locale
     * @param bool $preview
     * @return array
     */
    public function getNodeMenu($url, $locale, $preview = false)
    {
        try
        {
            $nodeTranslation = $this->getNodeTranslation($url, $locale, $preview);
        }
        catch (Exception $e)
        {
            throw $e;
        }

        $node = $nodeTranslation->getNode();

        $nodeMenu =
            new NodeMenu($this->em,
                $this->securityContext,
                $this->aclHelper,
                $locale,
                $node,
                PermissionMap::PERMISSION_VIEW,
                $preview);

        if (false === $this->securityContext->isGranted(PermissionMap::PERMISSION_VIEW, $node))
        {
            throw new AccessDeniedException('You do not have sufficient rights to access this page.');
        }

        return $nodeMenu;
    }


    /**
     * Get the page associated with the given url & locale
     * @param $url
     * @param $locale
     * @param bool $preview
     * @return mixed
     */
    public function getPage($url, $locale, $preview = false)
    {
        try
        {
            $nodeTranslation = $this->getNodeTranslationForUrl($url, $locale, $preview);
            $node = $nodeTranslation->getNode();

            if (false === $this->securityContext->isGranted(PermissionMap::PERMISSION_VIEW, $node))
            {
                throw new AccessDeniedException('You do not have sufficient rights to access this page.');
            }
        }
        catch (Exception $e)
        {
            throw $e;
        }

        //TODO: Implement Preview functionality from SlugController
        return $nodeTranslation->getPublicNodeVersion()->getRef($this->em);
    }


    /**
     * @param $url
     * @param $locale
     * @param bool $preview
     * @return mixed
     */
    public function getNodeTranslation($url, $locale, $preview = false)
    {
        $nodeTranslation =
            $this->em->getRepository('KunstmaanNodeBundle:NodeTranslation')->getNodeTranslationForUrl($url, $locale);

        // If no node translation -> 404
        if (!$nodeTranslation)
        {
            throw new NotFoundHttpException('No page found for slug ' . $url);
        }

        // check if the requested node is online, else throw a 404 exception (only when not previewing!)
        if (!$preview && !$nodeTranslation->isOnline())
        {
            throw new NotFoundHttpException("The requested page is not online");
        }

        return $nodeTranslation;
    }

}