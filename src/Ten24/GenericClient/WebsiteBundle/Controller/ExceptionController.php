<?php

namespace Ten24\GenericClient\WebsiteBundle\Controller;

use Symfony\Bundle\TwigBundle\Controller\ExceptionController as BaseExceptionController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\FlattenException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Ten24\GenericClient\WebsiteBundle\Helper\NodeMenuHelper;

class ExceptionController extends BaseExceptionController
{
    /**
     * @var
     */
    private $locale;

    private $nodeMenuService;

    /**
     * @param \Twig_Environment $twig
     * @param                   $debug
     */
    public function __construct(\Twig_Environment $twig, $debug, $locale, NodeMenuHelper $nodeMenuService)
    {
        parent::__construct($twig, $debug);
        $this->locale = $locale;
        $this->nodeMenuService = $nodeMenuService;
    }

    /**
     * @todo - this could be a response listener maybe, all we need to do is add the node menu into the response
     *
     * @param \Symfony\Component\HttpFoundation\Request                $request
     * @param \Symfony\Component\HttpKernel\Exception\FlattenException $exception
     * @param \Symfony\Component\HttpKernel\Log\DebugLoggerInterface   $logger
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showAction(Request $request, FlattenException $exception, DebugLoggerInterface $logger = null)
    {
        try
        {
            $nodeMenu = $this->nodeMenuService->getNodeMenu($request->get('url', null), $this->locale);
        }
        catch(\Exception $e)
        {
            $nodeMenu = null;
        }

        $currentContent = $this->getAndCleanOutputBuffering($request->headers->get('X-Php-Ob-Level', -1));
        $showException = $request->attributes->get('showException', $this->debug); // As opposed to an additional parameter, this maintains BC

        $code = $exception->getStatusCode();

        return new Response($this->twig->render(
            $this->findTemplate($request, $request->getRequestFormat(), $code, $showException),
            [
                'nodemenu' => $nodeMenu,
                'status_code' => $code,
                'status_text' => isset(Response::$statusTexts[$code]) ? Response::$statusTexts[$code] : '',
                'exception' => $exception,
                'logger' => $logger,
                'currentContent' => $currentContent,
            ]
        ));
    }
}